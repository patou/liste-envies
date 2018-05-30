import {Component, OnInit} from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {AuthService} from '../../service/auth.service';
import * as firebase from 'firebase';
import {Observable} from 'rxjs/Observable';
import {WishListService} from '../../service/wish-list-service';
import {WishList} from '../../models/WishList';
@Component({
  selector: 'app-page-nav',
  templateUrl: './page-nav.component.html',
  styleUrls: ['./page-nav.component.scss']
})
export class PageNavComponent  implements OnInit {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  public userAuth: Observable<firebase.User>;

  public lists: WishList[];
  private list$: Observable<WishList[]>;

  constructor(private breakpointObserver: BreakpointObserver,
              private wishListService: WishListService,
              private auth: AuthService) {}



  ngOnInit() {
    this.userAuth = this.auth.user;
    this.list$ = this.wishListService.list;

    this.list$.subscribe(lists => this.lists = lists, error => this.lists = []);
  }

  connect() {
    this.auth.openLoginPopUp();
  }

  logout() {
    this.auth.logout();
  }
  
  }
