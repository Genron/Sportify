import {Component} from '@angular/core';
import {IonicPage, Keyboard, NavController, NavParams} from 'ionic-angular';
import {FirebaseServiceProvider} from "../../providers/firebase-service/firebase-service";
import {Observable} from "rxjs/Observable";

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
  attendingTeams: Observable<any[]>;
  attTeams: any;
  data: any;
  selectedGame: any;
  team: any[];
  aaaTeams: any[];

  contacts: any[];

  constructor(public navCtrl: NavController, public navParams: NavParams, public firebaseService: FirebaseServiceProvider, private keyboard: Keyboard) {
    this.selectedGame = this.navParams.get("game");
    this.aaaTeams = this.navParams.get("aTeams");
    this.attendingTeams = this.firebaseService.getTeams(this.selectedGame);

    this.aaaTeams.sort((a, b) => a.score < b.score ? 1 : -1);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RankPage');
  }

}
