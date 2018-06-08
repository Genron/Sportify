import {Component, ViewChild} from '@angular/core';
import {Content, NavController, ToastController} from 'ionic-angular';

import {FirebaseServiceProvider} from './../../providers/firebase-service/firebase-service';
import {Observable} from 'rxjs/Observable';

import {Keyboard} from '@ionic-native/keyboard';
import {DetailPage} from "../detail/detail";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  availableGames: Observable<any[]>;
  newGame: any = '';
  subscriptions: any[] = [];
  @ViewChild(Content) content: Content;

  constructor(public navCtrl: NavController, public firebaseService: FirebaseServiceProvider, private keyboard: Keyboard,
              private toastCtrl: ToastController) {
    this.availableGames = this.firebaseService.getGames();
  }

  addGame() {
    if (this.newGame.length === 0 || !this.newGame.trim()) {
      console.log("empty");
    } else {
      this.firebaseService.createGame(this.newGame)
        .then(_ => {
          this.newGame = "";
          this.keyboard.close();
          this.content.scrollToBottom();
        });
    }
  }

  removeGame(key) {
    this.firebaseService.deleteGame(key);
  }

  gameDone(key, isDone) {
    this.firebaseService.gameDone(key, isDone);
  }

  onScroll(event) {
    this.keyboard.close();
  }

  gameTapped(event, game) {
    if (!game.isDone) {
      this.navCtrl.push(DetailPage, {
        selGame: game
      }).then(_ => console.log("To the detail page"));
    } else {
      console.log("Game is done. Undo to access the game");
      this.showGameDoneToast();
    }
  }

  ionViewWillEnter() {

  }

  ionViewWillLeave() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  showGameDoneToast() {
    let gameDoneToast = this.toastCtrl.create({
      message: 'This game is already done. Undo to access the game.',
      duration: 3000,
      position: 'top'
    });

    gameDoneToast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    gameDoneToast.present();
  }
}
