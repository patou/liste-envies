import {Component, OnInit} from '@angular/core';
/*
import { MasonryOptions } from 'ngx-masonry';
*/
import {WishListService} from '../../service/wish-list-service';
import {Observable} from 'rxjs/Observable';
import {WishList} from '../../models/WishList';
import {WishItem} from '../../models/WishItem';
import {ActivatedRoute} from '@angular/router';
import {AuthService} from '../../service/auth.service';
import * as firebase from 'firebase';
import {RouteData, RouteParams} from 'angular-xxl';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  @RouteData('whishesItems') list$: Observable<WishItem[]>;
  @RouteData('whishList', {observable: false}) whishList: WishList;


  public userAuth: Observable<firebase.User>;

  @RouteParams('listId', {observable: false}) public listId: string;

  constructor(private wishListService: WishListService, private route: ActivatedRoute, private auth: AuthService) {

  }

  ngOnInit() {
    this.userAuth = this.auth.user;

    this.userAuth.subscribe(value => {
      this.list$ = this.wishListService.wishes(this.route.snapshot.params['listId']);
      console.log('user AUTH NEXT in list page / ', value);
    });


  }

}

