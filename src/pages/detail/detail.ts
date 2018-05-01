import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {FirebaseServiceProvider} from './../../providers/firebase-service/firebase-service';

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
  private selectedItem: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public firebaseService: FirebaseServiceProvider) {
    this.selectedItem = navParams.get("item");

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailPage');
  }

  updateItem() {
    this.firebaseService.updateItem(this.selectedItem.key, this.selectedItem.value).then(() => {
      this.navCtrl.pop();
    });
  }


}
