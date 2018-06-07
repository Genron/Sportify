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
  selectedGame: any;
  sortedTeams: any[];
  subscriptions: any[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public firebaseService: FirebaseServiceProvider, private keyboard: Keyboard) {
    this.selectedGame = this.navParams.get("selGame");
    this.attendingTeams = this.firebaseService.getTeams(this.selectedGame);

    this.sortedTeams = [];
    this.subscriptions.push(this.attendingTeams.subscribe(allTeams => {
      this.sortedTeams = allTeams.sort((team1, team2) => team1.score < team2.score ? 1 : -1);
    }));
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RankPage');
  }

  ionViewWillLeave() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
