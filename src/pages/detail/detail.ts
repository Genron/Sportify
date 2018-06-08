import {Component, ViewChild} from '@angular/core';
import {Content, IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {FirebaseServiceProvider} from './../../providers/firebase-service/firebase-service';
import {Observable} from "rxjs/Observable";
import {Keyboard} from "@ionic-native/keyboard";
import {VersusPage} from "../versus/versus";
import {HomePage} from "../home/home";


/**
 * Generated class for the DetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-detail',
  templateUrl: 'detail.html',
})
export class DetailPage {
  selectedGame: any;

  teams: Observable<any[]>;
  newTeam: any = '';
  isDisabled: boolean = true;
  subscriptions: any[] = [];

  @ViewChild(Content) content: Content;

  constructor(public navCtrl: NavController, public navParams: NavParams, public firebaseService: FirebaseServiceProvider,
              private keyboard: Keyboard, private toastCtrl: ToastController) {
    this.selectedGame = navParams.get("selGame");
    this.teams = this.firebaseService.getTeams(this.selectedGame);
  }

  addTeam() {
    if (this.newTeam.length === 0 || !this.newTeam.trim()) {
      console.log("empty");
    } else {
      this.firebaseService.clearMatches(this.selectedGame);
      this.firebaseService.addTeam(this.selectedGame, this.newTeam)
        .then(_ => {
          this.newTeam = "";
          this.content.scrollToBottom();
        });
      this.firebaseService.clearPoints(this.selectedGame);
    }
  }

  removeTeam(team) {
    this.firebaseService.clearMatches(this.selectedGame);
    this.firebaseService.deleteTeam(team, this.selectedGame);
    this.firebaseService.clearPoints(this.selectedGame);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailPage');
  }

  ionViewWillEnter() {
    this.subscriptions.push(this.teams.subscribe(allTeams => {
      this.isDisabled = allTeams.length < 2;
      console.log("changed disabled to: " + this.isDisabled);
    }));
  }

  ionViewWillLeave() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  onScroll(event) {
    this.keyboard.close();
  }

  startVersus(event) {

    this.navCtrl.push(VersusPage, {
      selGame: this.selectedGame
    }).then(_ => console.log("To the versus page"));
  }

  toHome() {
    this.navCtrl.push(HomePage);
  }

  showNoTeamToast() {
    if (this.isDisabled) {
      let noTeamToast = this.toastCtrl.create({
        message: 'Create at least two teams to start the game.',
        duration: 3000,
        position: 'top'
      });

      noTeamToast.onDidDismiss(() => {
        console.log('Dismissed toast');
      });
      noTeamToast.present();
    }
  }
}
