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
  // isDisabled: boolean = true;

  @ViewChild(Content) content: Content;

  constructor(public navCtrl: NavController, public navParams: NavParams, public firebaseService: FirebaseServiceProvider, private keyboard: Keyboard) {
    this.selectedGame = navParams.get("item");
    this.teams = this.firebaseService.getTeams(this.selectedGame);

    this.teams.subscribe(
      x => {
        // this.isDisabled = !(x.length % 2 === 0 && x.length !== 0);
        this.matchTeams(x)
      },
      e => console.log('onError: %s', e),
      () => console.log('onCompleted')
    );
  }

  matchTeams(allTeams) {
    let opponents;
    let myTeamName;

    this.clearMatches();
    for (let i = 0; i < allTeams.length; i++) {
      for (let j = i + 1; j < allTeams.length; j++) {
        let match = allTeams[i].teamName + " vs. " + allTeams[j].teamName;
        console.log("Match: " + match);
        this.addMatch(allTeams[i], allTeams[j]);
      }
    }
  }

  clearMatches() {
    console.log("Clearing all matches");

    this.firebaseService.clearMatches(this.selectedGame);
  }

  addMatch(team1, team2) {
    console.log("versus.ts addMatch-> Selected Game " + this.selectedGame + " Team1: " + team1 + " Team2: " + team2);

    this.firebaseService.addMatch(this.selectedGame, team1, team2);
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

  startVersus(event) {
    this.navCtrl.push(VersusPage, {
      attendingTeams: this.teams,
      selGame: this.selectedGame
    });
    console.log("To the versus page");
  }
}
