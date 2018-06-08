import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {Observable} from "rxjs/Observable";
import {Keyboard} from "@ionic-native/keyboard";
import {FirebaseServiceProvider} from "../../providers/firebase-service/firebase-service";
import {RankPage} from "../rank/rank";
import {HomePage} from "../home/home";


/**
 * Generated class for the VersusPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-versus',
  templateUrl: 'versus.html',
})
export class VersusPage {
  teams: Observable<any[]>;
  selectedGame: any;
  matches: Observable<any[]>;
  teamsArray: any;
  subscriptions: any[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public firebaseService: FirebaseServiceProvider,
              private keyboard: Keyboard) {
    this.selectedGame = navParams.get("selGame");

    this.teams = this.firebaseService.getTeams(this.selectedGame);
    this.matches = this.firebaseService.getMatches(this.selectedGame);

    let matchesArray = [];
    this.subscriptions.push(this.matches.subscribe(allMatches => matchesArray = allMatches));
    this.subscriptions.push(this.teams.subscribe(allTeams => {
      if (matchesArray.length === 0) {
        this.matchTeams(allTeams);
      }
    }));
  }

  matchTeams(allTeams) {
    for (let i = 0; i < allTeams.length; i++) {
      for (let j = i + 1; j < allTeams.length; j++) {
        this.firebaseService.addMatch(this.selectedGame, allTeams[i], allTeams[j]);
      }
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VersusPage');
  }

  onScroll(event) {
    this.keyboard.close();
  }

  logWin(match, leftPoint, rightPoint) {
    this.firebaseService.updateMatch(this.selectedGame, match, leftPoint, rightPoint);
  }

  ionViewWillLeave() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  showRanking() {
    this.navCtrl.push(RankPage, {
      selGame: this.selectedGame,
      // sortTeams: this.teamsArray
    });
    console.log("To the rank page");
  }

  toHome() {
    this.navCtrl.push(HomePage);
  }
}
