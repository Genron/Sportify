import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Observable} from "rxjs/Observable";
import {Keyboard} from "@ionic-native/keyboard";
import {FirebaseServiceProvider} from "../../providers/firebase-service/firebase-service";


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
  matches: any[];


  constructor(public navCtrl: NavController, public navParams: NavParams, public firebaseService: FirebaseServiceProvider,
              private keyboard: Keyboard) {
    this.teams = navParams.get("attendingTeams");
    this.selectedGame = navParams.get("selGame");
    this.teams.subscribe(
      x => this.matchTeams(x),
      e => console.log('onError: %s', e),
      () => console.log('onCompleted')
    );

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VersusPage');
  }

  matchTeams(allTeams){
    let opponents;
    let myTeamName;
    this.matches = [];

    for (let i = 0; i < allTeams.length; i++) {
      for (let j = i+1; j < allTeams.length; j++) {
        let match = allTeams[i].teamName + " vs. " + allTeams[j].teamName;
        console.log("Match: " + match);
        this.matches.push(match);
        this.addMatch(allTeams[i], allTeams[j]);
      }
    }

    // allTeams.forEach(team =>{
    //   opponents = allTeams.slice();
    //   myTeamName = opponents.splice(allTeams.indexOf(team), 1)[0].teamName;
    //   this.matches.push(myTeamName);
    //   opponents.forEach(opponent => this.matches.push(opponent.teamName));
    // });
      console.log(this.matches);
    }

  onScroll(event) {
    this.keyboard.close();
  }

  addMatch(team1, team2) {
    console.log("versus.ts addMatch-> Selected Game " + this.selectedGame + " Team1: " + team1 + " Team2: " + team2);

    this.firebaseService.addMatch(this.selectedGame, team1, team2);
  }

}
