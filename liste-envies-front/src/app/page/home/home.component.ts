import {Component, OnInit} from '@angular/core';
import {WishListService} from '../../service/wish-list-service';
import {Observable} from 'rxjs/Observable';
import {WishList} from '../../models/WishList';
import * as firebase from 'firebase';
import {AuthService} from '../../service/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public userAuth: Observable<firebase.User>;

  list: Observable<WishList[]>;
  constructor(
    private wishListService: WishListService,
    private auth: AuthService) { }

  ngOnInit() {
    this.userAuth = this.auth.user;
    this.list = this.wishListService.list;
  }

  newList() {

  }

  connect() {
    this.auth.openLoginPopUp();
  }
}
