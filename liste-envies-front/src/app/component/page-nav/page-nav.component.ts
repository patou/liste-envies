import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { map } from "rxjs/operators";
import { AuthService } from "../../service/auth.service";
import * as firebase from "firebase";
import { Observable } from "rxjs/Observable";
import { WishesListQuery } from "../../state/wishes/wishes-list.query";
import { WishList } from "../../models/WishList";

@Component({
  selector: "app-page-nav",
  templateUrl: "./page-nav.component.html",
  styleUrls: ["./page-nav.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageNavComponent implements OnInit {
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map(result => result.matches));

  public userAuth: Observable<firebase.User>;

  private myList$: Observable<WishList[]>;
  private otherList$: Observable<WishList[]>;
  private myListCount$: Observable<number>;
  private otherListCount$: Observable<number>;
  private loading$: Observable<boolean>;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private wishesListQuery: WishesListQuery,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.userAuth = this.auth.user;
    this.myList$ = this.wishesListQuery.selectAll({
      filterBy: list => list.owner
    });
    this.myListCount$ = this.wishesListQuery.selectCount(list => list.owner);
    this.otherList$ = this.wishesListQuery.selectAll({
      filterBy: list => !list.owner
    });
    this.otherListCount$ = this.wishesListQuery.selectCount(
      list => !list.owner
    );
    this.loading$ = this.wishesListQuery.selectLoading();
  }

  connect() {
    this.auth.openLoginPopUp();
  }

  logout() {
    this.auth.logout();
  }
}
