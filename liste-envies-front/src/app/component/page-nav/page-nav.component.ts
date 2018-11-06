import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { AuthService } from '../../service/auth.service';
import * as firebase from 'firebase';
import { Observable } from 'rxjs/Observable';
import { WishList } from '../../models/WishList';
import {WishesListQuery} from '../../state/wishes/wishes-list.query';
import {WishesList} from '../../state/wishes/wishes-list.model';
@Component({
  selector: 'app-page-nav',
  templateUrl: './page-nav.component.html',
  styleUrls: ['./page-nav.component.scss']
})
export class PageNavComponent implements OnInit {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  public userAuth: Observable<firebase.User>;

  private list$: Observable<WishesList[]>;
  private loading$: Observable<boolean>;

  constructor(private breakpointObserver: BreakpointObserver,
    private wishesListQuery: WishesListQuery,
    private auth: AuthService) { }



  ngOnInit() {
    this.userAuth = this.auth.user;
    this.list$ = this.wishesListQuery.selectAll();
    this.loading$ = this.wishesListQuery.selectLoading();
  }

  connect() {
    this.auth.openLoginPopUp();
  }

  logout() {
    this.auth.logout();
  }

}
