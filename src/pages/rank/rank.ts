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

    console.log("TEAMS (HOPEFULLY AN ARRAY)");
    console.log(this.aaaTeams);
    console.log(this.aaaTeams[0]);


    this.aaaTeams.sort((a, b) => a.score < b.score ? 1 : -1);

    // this.attTeams = this.attendingTeams
    //   .forEach(value => {
    //     value.sort((a, b) => a < b ? -1 : 1);
    //     this.data = value;
    //   });
    // .subscribe((data) => {
    //   data.sort((a, b) => {
    //     return a < b ? -1 : 1;
    //   });
    //   this.data = data;
    // });

    //
    //
    // this.attendingTeams.forEach(value => {
    //   this.attTeams.push(value);
    // })


    // this.attTeams.forEach(value => console.log(value));
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RankPage');
    // this.attendingTeams
    //   .subscribe(res => this.contacts = res as any[]);


    // console.log(this.attTeams);
    // console.log(this.data);
    // console.log(this.contacts);
  }

}
