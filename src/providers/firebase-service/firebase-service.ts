import {Injectable} from '@angular/core';

import {AngularFireDatabase} from 'angularfire2/database';
import {AngularFireList} from 'angularfire2/database';
import {Observable} from 'rxjs/Observable';


/*
  Generated class for the FirebaseServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FirebaseServiceProvider {

  gamesRef: AngularFireList<any>;
  games: Observable<any[]>;
  teamsRef: AngularFireList<any>;
  teams: Observable<any[]>;
  matchesRef: AngularFireList<any>;

  constructor(public afd: AngularFireDatabase) {
    this.gamesRef = this.afd.list('/games/');
    this.games = this.gamesRef.snapshotChanges().map(changes => {
      return changes.map(c => ({key: c.payload.key, ...c.payload.val()}));
    });

  }

  getGames() {
    return this.games;
  }

  getTeams(selectedGame) {
    this.teamsRef = this.afd.list('/games/' + selectedGame.key + '/teams/');
    return this.teamsRef.snapshotChanges().map(changes => {
      return changes.map(c => ({key: c.payload.key, ...c.payload.val()}));
    });
  }

  createGame(newName) {
    return this.gamesRef.push({gameName: newName, isDone: false});
  }

  addTeam(selectedGame, newName) {
    // TODO: Add the Team to the Game
    // return this.gamesRef.push({value: newName, isDone: false, teams: []});
    this.teamsRef = this.afd.list('/games/' + selectedGame.key + '/teams/');

    return this.teamsRef.push({teamName: newName, isBeaten: false});
  }

  addMatch(selectedGame, team1, team2) {
    console.log("Firebase addMatch-> Selected Game " + selectedGame + " Team1: " + team1 + " Team2: " + team2);
    // TODO: Add the Team to the Game
    // return this.gamesRef.push({value: newName, isDone: false, teams: []});
    this.matchesRef = this.afd.list('/games/' + selectedGame.key + '/matches/');

    return this.matchesRef.push({team1: team1, team2: team2, played: false});
  }

  updateGame(key, newGameName) {
    return this.gamesRef.update(key, {value: newGameName});
  }

  //sets a game to done or undone
  gameDone(key, isDone) {
    return this.gamesRef.update(key, {isDone: isDone});
  }

  deleteGame(key) {
    this.gamesRef.remove(key);
  }

  deleteTeam(key) {
    this.teamsRef.remove(key);
  }
}


