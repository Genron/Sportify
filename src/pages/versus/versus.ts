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

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.teams = navParams.get("attendingTeams");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VersusPage');
  }

}
