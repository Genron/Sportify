import {Component} from '@angular/core';
import {IonicPage, Keyboard, NavController, NavParams} from 'ionic-angular';
import {FirebaseServiceProvider} from "../../providers/firebase-service/firebase-service";
import {Observable} from "rxjs/Observable";
import {HomePage} from "../home/home";

/**
 * Generated class for the RankPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-rank',
  templateUrl: 'rank.html',
})
export class RankPage {
  matches: Observable<any[]>;
  selectedGame: any;
  sortedTeams: any[] = [];
  subscriptions: any[] = [];
  teamsMap = new Map();
  gameDone: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, public firebaseService: FirebaseServiceProvider, private keyboard: Keyboard) {
    this.selectedGame = this.navParams.get("selGame");
    this.matches = this.firebaseService.getMatches(this.selectedGame);
    this.gameDone = this.navParams.get("allMatchesDone");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RankPage');
  }

  ionViewWillEnter() {
    this.subscriptions.push(this.matches.subscribe(allMatches => {
      this.teamsMap = new Map();
      allMatches.forEach(match => {
        let team1 = match.team1;
        let team2 = match.team2;
        let tempScore = 0;
        if (this.teamsMap.has(team1.key)) {
          tempScore = this.teamsMap.get(team1.key).score;
        }
        this.teamsMap.set(team1.key, {teamName: team1.teamName, score: team1.score + tempScore});

        tempScore = 0;
        if (this.teamsMap.has(team2.key)) {
          tempScore = this.teamsMap.get(team2.key).score;
        }
        this.teamsMap.set(team2.key, {teamName: team2.teamName, score: team2.score + tempScore});
      });

      this.sortedTeams = [];
      this.teamsMap.forEach(team => this.sortedTeams.push(team));
      this.sortedTeams.sort((team1, team2) => team1.score < team2.score ? 1 : -1);

      let rank = 1;
      for (let i = 0; i < this.sortedTeams.length; i++) {
        let teamName = this.sortedTeams[i].teamName;
        let score = this.sortedTeams[i].score;
        let actualRank = rank++; // Incriese the rank (for when all teams have different points)
        if (i > 0 && this.sortedTeams[i - 1].score === score) {
          actualRank = rank - 2; // Get the previous rank
          rank--; // Decrease the count, thus there is multiple times the same rank
        }
        this.sortedTeams[i] = {rank: actualRank, teamName: teamName, score: score};
      }
      this.sortedTeams.forEach(team => console.log(team));
    }));
  }

  ionViewWillLeave() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  toHome() {
    this.navCtrl.push(HomePage);
  }

  backToHome() {
    this.firebaseService.gameDone(this.selectedGame.key, this.gameDone);
    this.navCtrl.push(HomePage);
  }
}
