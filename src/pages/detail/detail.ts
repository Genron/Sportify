import {Component, ViewChild} from '@angular/core';
import {Content, IonicPage, NavController, NavParams} from 'ionic-angular';
import {FirebaseServiceProvider} from './../../providers/firebase-service/firebase-service';
import {Observable} from "rxjs/Observable";
import {Keyboard} from "@ionic-native/keyboard";


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

  @ViewChild(Content) content: Content;
  constructor(public navCtrl: NavController, public navParams: NavParams, public firebaseService: FirebaseServiceProvider, private keyboard: Keyboard) {
    this.selectedGame = navParams.get("item");

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
    this.firebaseService.deleteItem(id);
  }

  doneItem(key, status) {
    this.firebaseService.doneItem(key, status);
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
    this.firebaseService.updateGame(this.selectedItem.key, this.selectedItem.value).then(() => {
      this.navCtrl.pop();
    });
  }


}
