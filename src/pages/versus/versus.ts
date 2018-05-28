import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Observable} from "rxjs/Observable";
import {Keyboard} from "@ionic-native/keyboard";


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
  team: any[];
  matches: any[];

  constructor(public navCtrl: NavController, public navParams: NavParams, private keyboard: Keyboard) {
    this.teams = navParams.get("attendingTeams");
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

    allTeams.forEach(team =>{
      opponents = allTeams.slice();
      myTeamName = opponents.splice(allTeams.indexOf(team), 1)[0].teamName;
      this.matches.push(myTeamName);
      opponents.forEach(opponent => this.matches.push(opponent.teamName));
    });
      console.log(this.matches);
    }

  onScroll(event) {
    this.keyboard.close();
  }

}
