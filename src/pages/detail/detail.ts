import {Component, ViewChild} from '@angular/core';
import {Content, IonicPage, NavController, NavParams} from 'ionic-angular';
import {FirebaseServiceProvider} from './../../providers/firebase-service/firebase-service';
import {Observable} from "rxjs/Observable";
import {Keyboard} from "@ionic-native/keyboard";
import {VersusPage} from "../versus/versus";


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

  @ViewChild(Content) content: Content;
  constructor(public navCtrl: NavController, public navParams: NavParams, public firebaseService: FirebaseServiceProvider, private keyboard: Keyboard) {
    this.selectedGame = navParams.get("item");
    this.teams = this.firebaseService.getTeams(this.selectedGame);

    this.teams.subscribe(
      x => this.isDisabled = !(x.length % 2 === 0 && x.length !== 0),
      e => console.log('onError: %s', e),
      () => console.log('onCompleted')
    );
  }

  addTeam() {
    if (this.newTeam.length === 0 || !this.newTeam.trim()) {
      console.log("empty");
    } else {
      this.firebaseService.addTeam(this.selectedGame, this.newTeam).then(() => {
        this.newTeam = "";
        this.keyboard.close();
        this.content.scrollToBottom();
      });
    }
  }

  removeTeam(id) {
    this.firebaseService.deleteTeam(id);
  }

  doneItem(key, status) {
    this.firebaseService.gameDone(key, status);
  }

  itemTapped(event, team) {
    // That's right, we're pushing to ourselves!
    this.navCtrl.push(DetailPage, {
      team: team
    });
    console.log("Hello");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailPage');
  }

  updateItem() {
    this.firebaseService.updateGame(this.selectedGame.key, this.selectedGame.value).then(() => {
      this.navCtrl.pop();
    });
  }

  onScroll(event) {
    this.keyboard.close();
  }

  startVersus(event){
    this.navCtrl.push(VersusPage, {
      attendingTeams: this.teams,
      selGame: this.selectedGame
    });
    console.log("To the versus page");
  }
}
