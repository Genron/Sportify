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

  constructor(public navCtrl: NavController, public navParams: NavParams, public firebaseService: FirebaseServiceProvider, private keyboard: Keyboard) {
    this.selectedGame = this.navParams.get("selGame");
    this.matches = this.firebaseService.getMatches(this.selectedGame);

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
      for (let i = 0; i < this.sortedTeams.length; i++) {
        let name = this.sortedTeams[i].teamName;
        let scor = this.sortedTeams[i].score;
        let plac = i + 1;
        this.sortedTeams[i] = {rank: plac, teamName: name, score: scor};
      }
      this.sortedTeams.forEach(team => console.log(team));
    }));
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RankPage');
  }

  ionViewWillLeave() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  toHome() {
    this.navCtrl.push(HomePage);
  }

  backToHome() {
    this.firebaseService.gameDone(this.selectedGame.key, true);
    this.navCtrl.push(HomePage);
  }
}
