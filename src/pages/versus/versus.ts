import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {Observable} from "rxjs/Observable";
import {Keyboard} from "@ionic-native/keyboard";
import {FirebaseServiceProvider} from "../../providers/firebase-service/firebase-service";
import {RankPage} from "../rank/rank";


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
  team: any[];
  matches: Observable<any[]>;
  attTeams: any[];
  newTry: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public firebaseService: FirebaseServiceProvider,
              private keyboard: Keyboard) {
    this.selectedGame = navParams.get("selGame");
    this.matches = this.firebaseService.getMatches(this.selectedGame);
    this.teams = navParams.get("attendingTeams");


    this.teams.subscribe(value => {
      console.log("SOMETHING CHANGED IN TEAMS!!!!");
      this.newTry = value as any[];
      console.log(this.newTry);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VersusPage');

    // this.attTeams = [];
    // this.teams
    //   .subscribe(team => this.attTeams = team as any[]);


    // console.log(this.attTeams);
    // console.log(this.data);
    // console.log(this.attTeams);
  }

  onScroll(event) {
    this.keyboard.close();
  }

  teamWins(match, leftTeamIsWinning) {
    // leftTeamIsWinning -> boolean
    console.log("Match: " + match + "Winning Team" + leftTeamIsWinning);
    this.firebaseService.updateMatch(this.selectedGame, match, leftTeamIsWinning);
  }

  draw(match) {
    console.log("Match: " + match);
    this.firebaseService.updateMatchDraw(match);

  }

  showRanking() {
    this.navCtrl.push(RankPage, {
      playingTeams: this.teams,
      game: this.selectedGame,
      aTeams: this.newTry
    });
    console.log("To the rank page");

  }
}
