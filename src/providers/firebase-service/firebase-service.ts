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
  teamsRef: AngularFireList<any>;
  games: Observable<any[]>;

  constructor(public afd: AngularFireDatabase) {
    this.gamesRef = this.afd.list('/games/');
    this.games = this.gamesRef.snapshotChanges().map(changes => {
      return changes.map(c => ({key: c.payload.key, ...c.payload.val()}));
    });

  }

  getGames() {
    return this.games;
  }

  createGame(newName) {
    return this.gamesRef.push({value: newName, isDone: false, teams: []});
  }

  addTeam(selectedGame, newName) {
    // TODO: Add the Team to the Game
    // return this.gamesRef.push({value: newName, isDone: false, teams: []});
    this.teamsRef = this.afd.list('/games/' + selectedGame.key + '/');

    return this.teamsRef.push({teamName: newName});
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
}


