import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {Observable} from "rxjs/Observable";
import {Keyboard} from "@ionic-native/keyboard";
import {FirebaseServiceProvider} from "../../providers/firebase-service/firebase-service";
import {RankPage} from "../rank/rank";
import {HomePage} from "../home/home";


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
  selectedGame: any;
  matches: Observable<any[]>;
  subscriptions: any[] = [];
  matchesPlayed: number;
  allMatches: number;

  constructor(public navCtrl: NavController, public navParams: NavParams, public firebaseService: FirebaseServiceProvider,
              private keyboard: Keyboard, private toastCtrl: ToastController, private alertCtrl: AlertController) {
    this.selectedGame = navParams.get("selGame");

    this.teams = this.firebaseService.getTeams(this.selectedGame);
    this.matches = this.firebaseService.getMatches(this.selectedGame);
  }

  matchTeams(allTeams) {
    for (let i = 0; i < allTeams.length; i++) {
      for (let j = i + 1; j < allTeams.length; j++) {
        this.firebaseService.addMatch(this.selectedGame, allTeams[i], allTeams[j]);
      }
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VersusPage');
  }

  onScroll(event) {
    this.keyboard.close();
  }

  logMatch(match, leftPoint, rightPoint) {
    let t1 = match.team1.score + leftPoint;
    let t2 = match.team2.score + rightPoint;
    this.firebaseService.updateMatch(this.selectedGame, match, t1, t2);
  }

  ionViewWillEnter() {
    let matchesArray = [];
    this.subscriptions.push(this.matches.subscribe(allMatches => {
      matchesArray = allMatches;

      this.allMatches = matchesArray.length;
      this.matchesPlayed = 0;
      matchesArray.forEach(match => {
        if (match.played) {
          this.matchesPlayed++;
        }
      })
    }));

    this.subscriptions.push(this.teams.subscribe(allTeams => {
      if (matchesArray.length === 0) {
        this.matchTeams(allTeams);
      }
    }));
  }

  ionViewWillLeave() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  showRanking() {
    this.navCtrl.push(RankPage, {
      selGame: this.selectedGame,
      allMatchesDone: this.matchesPlayed === this.allMatches
    });
    console.log("To the rank page");
  }

  toHome() {
    this.navCtrl.push(HomePage);
  }

  showSlideToast() {
    let slideToast = this.toastCtrl.create({
      message: 'Swipe to log the match.',
      duration: 3000,
      position: 'top'
    });

    slideToast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    slideToast.present();
  }

  presentPrompt(match) {
    let t1 = match.team1.teamName;
    let t2 = match.team2.teamName;

    let alert = this.alertCtrl.create({
      title: match.team1.teamName + ' vs. ' + match.team2.teamName,
      subTitle: ':',
      inputs: [
        {
          name: t1,
          type: 'number',
          value: match.team1.score,
          min: 0,
          id: 'left-input'
        },
        {
          name: t2,
          type: 'number',
          value: match.team2.score,
          min: 0,
          id: 'right-input'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Log',
          handler: data => {
            console.log('Log clicked');
            const values = Object.keys(data).map(key => data[key]);
            console.log(values);
            this.logMatch(match, values[0] - match.team1.score, values[1] - match.team2.score);
          }
        }
      ]
    });
    alert.present();
  }
}
