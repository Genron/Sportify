import {Injectable} from '@angular/core';

import {AngularFireDatabase, AngularFireList} from 'angularfire2/database';
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
    return this.gamesRef.push({gameName: newName, isDone: false}).then(_ => console.log("Game created"));
  }

  addTeam(selectedGame, newName) {
    this.teamsRef = this.afd.list('/games/' + selectedGame.key + '/attendingTeams/');
    return this.teamsRef.push({teamName: newName, score: 0}).then(_ => console.log("Team added"));
    ;
  }

  getMatches(selectedGame) {
    this.matchesRef = this.afd.list('/games/' + selectedGame.key + '/matches/');
    return this.matchesRef.snapshotChanges().map(changes => {
      return changes.map(c => ({key: c.payload.key, ...c.payload.val()}));
    });
  }

  addMatch(selectedGame, team1, team2) {
    this.matchesRef = this.afd.list('/games/' + selectedGame.key + '/matches/');
    return this.matchesRef.push({team1: team1, team2: team2, played: false})
      .then(_ => console.log("Match added"));
  }

  updateGame(key, newGameName) {
    return this.gamesRef.update(key, {value: newGameName});
  }

  //sets a game to done or undone
  gameDone(key, isDone) {
    return this.gamesRef.update(key, {isDone: isDone});
  }

  deleteGame(key) {
    this.gamesRef.remove(key).then(_ => console.log("Game removed"));
  }

  deleteTeam(team) {
    this.teamsRef.remove(team.key).then(_ => console.log("Team removed"));
  }

  clearMatches(selectedGame) {
    this.matchesRef = this.afd.list('/games/' + selectedGame.key + '/matches/');
    this.matchesRef.remove().then(_ => console.log("Matches cleared"));
  }

  updateMatch(selectedGame, match, leftPoint, rightPoint) {
    this.teamsRef = this.afd.list('/games/' + selectedGame.key + '/attendingTeams/');
    this.matchesRef = this.afd.list('/games/' + selectedGame.key + '/matches/');
    this.matchesRef.update(match.key, {played: true});

    let ref = this.afd.list('/games/' + selectedGame.key + '/matches/' + match.key);
    if (leftPoint && rightPoint) {
      console.log(match.team1.teamName + " and " + match.team2.teamName + " wins");
      this.teamsRef.update(match.team1.key, {score: match.team1.score + 1})
        .then(_ => this.teamsRef.update(match.team2.key, {score: match.team2.score + 1}));
    } else {
      if (leftPoint) {
        console.log(match.team1.teamName + " wins");
        this.teamsRef.update(match.team1.key, {score: match.team1.score + 3});
      } else {
        console.log(match.team2.teamName + " wins");
        this.teamsRef.update(match.team2.key, {score: match.team2.score + 3});
      }
    }

    // let newScore = team.score;
    // newScore += 50;
    // console.log(newScore);
    // this.teamsRef.update(team.key, {score: newScore});
    // this.matchesRef.update(match.key, {played: true})
    //   .then(_ => this.matchesRef.update(match.team1.key, {score: 30}));
  }

  updateMatchDraw(match) {
    this.teamsRef.update(match.team1.key, {score: match.team1.score + 1})
      .then(_ => this.teamsRef.update(match.team2.key, {score: match.team2.score + 1}));
    this.matchesRef.update(match.key, {played: true});
  }

  clearPoints(selectedGame) {
    this.teamsRef = this.afd.list('/games/' + selectedGame.key + '/attendingTeams/');

    let subscription = this.getTeams(selectedGame).subscribe(allTeams => {
      allTeams.forEach(team => {
        if (team.score !== 0) {
          this.teamsRef.update(team.key, {score: 0})
            .then(_ => console.log(team.teamName + " cleared score"));
        }
      })
    });

    setTimeout(_ => {
      subscription.unsubscribe();
      console.log("Points cleared");
    }, 500);
  }
}


