import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Observable} from "rxjs/Observable";

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

  constructor(public navCtrl: NavController, public navParams: NavParams) {
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
    for (let i = 0; i < allTeams.length ; i++) {
    // console.log("Anzahl: " + allTeams.length + " Teams: " + allTeams[i].teamName);
      let opponents = allTeams.slice(); //Create a copy of the teams
      // console.log("Anzahl: " + opponents.length + " Teams: " + opponents[i].teamName);
      let myTeam = opponents.splice(i, 1)[0]; //Cut my team out of opponents => opponents has now all other teams except this team
      // console.log("Anzahl: " + opponents.length + " Teams: " + opponents[0].teamName);
      console.log(opponents);
      console.log(myTeam.teamName);
    }

  }

}
