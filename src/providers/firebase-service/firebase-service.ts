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
    this.teamsRef = this.afd.list('/games/' + selectedGame.key + '/attendingTeams/');
    return this.teamsRef.snapshotChanges().map(changes => {
      return changes.map(c => ({key: c.payload.key, ...c.payload.val()}));
    });
  }

  createGame(newName) {
    return this.gamesRef.push({gameName: newName, isDone: false});
  }

  addTeam(selectedGame, newName) {
    // TODO: Add the Team to the Game
    // return this.gamesRef.push({value: newName, isDone: false, attendingTeams: []});
    this.teamsRef = this.afd.list('/games/' + selectedGame.key + '/attendingTeams/');

    return this.teamsRef.push({teamName: newName, score: 0});
  }

  getMatches(selectedGame) {
    this.matchesRef = this.afd.list('/games/' + selectedGame.key + '/matches/');
    return this.matchesRef.snapshotChanges().map(changes => {
      return changes.map(c => ({key: c.payload.key, ...c.payload.val()}));
    });
  }

  addMatch(selectedGame, team1, team2) {
    console.log("Firebase addMatch-> Selected Game " + selectedGame + " Team1: " + team1 + " Team2: " + team2);
    // TODO: Add the Team to the Game
    // return this.gamesRef.push({value: newName, isDone: false, attendingTeams: []});
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

  clearMatches(selectedGame) {
    this.matchesRef = this.afd.list('/games/' + selectedGame.key + '/matches/');
    this.matchesRef.remove().then(_ => console.log("Matches cleared"));
  }

  updateMatch(selectedGame, match, leftTeamIsWinning) {
    if (leftTeamIsWinning) {
      this.teamsRef.update(match.team1.key, {score: match.team1.score + 3});
    } else {
      this.teamsRef.update(match.team2.key, {score: match.team2.score + 3});
    }
    this.matchesRef.update(match.key, {played: true});
  }

  updateMatchDraw(match) {
    this.teamsRef.update(match.team1.key, {score: match.team1.score + 1})
      .then(_ => this.teamsRef.update(match.team2.key, {score: match.team2.score + 1}));
    this.matchesRef.update(match.key, {played: true});
  }
}


