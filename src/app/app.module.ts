import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { FirebaseServiceProvider } from '../providers/firebase-service/firebase-service';

import {HttpModule} from '@angular/http';
import {AngularFireDatabaseModule} from 'angularfire2/database';
import {AngularFireModule} from 'angularfire2';

import { Keyboard } from '@ionic-native/keyboard';
import {DetailPage} from "../pages/detail/detail";
import {VersusPage} from "../pages/versus/versus";

const firebaseConfig = {
  apiKey: "AIzaSyCNLMdjqkg1_IEhATcV2tlYsNz2_DIXf4A",
  authDomain: "sportify-ea39b.firebaseapp.com",
  databaseURL: "https://sportify-ea39b.firebaseio.com",
  projectId: "sportify-ea39b",
  storageBucket: "sportify-ea39b.appspot.com",
  messagingSenderId: "542806684553"
}
@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    VersusPage,
    DetailPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule,
    AngularFireDatabaseModule,
    AngularFireModule.initializeApp(firebaseConfig),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    VersusPage,
    DetailPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    FirebaseServiceProvider,
    StatusBar,
    SplashScreen,
    Keyboard
  ]
})
export class AppModule {}
