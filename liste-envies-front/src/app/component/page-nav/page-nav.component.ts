import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild
} from "@angular/core";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { map, tap } from "rxjs/operators";
import { AuthService } from "../../service/auth.service";
import * as firebase from "firebase";
import { Observable } from "rxjs/Observable";
import { WishesListQuery } from "../../state/wishes/wishes-list.query";
import { WishList } from "../../models/WishList";
import { NotificationsService } from "../../state/app/notifications.service";
import { NotificationsQuery } from "../../state/app/notifications.query";
import { MatDrawer } from "@angular/material";
import { debounce } from "lodash-decorators";
import { FormControl } from "@angular/forms";
import { Router } from "@angular/router";

@Component({
  selector: "app-page-nav",
  templateUrl: "./page-nav.component.html",
  styleUrls: ["./page-nav.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageNavComponent implements OnInit {
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      tap(ishandset => (this.isHandset = ishandset))
    );

  isHandset: boolean;

  public userAuth$: Observable<firebase.User>;

  public myList$: Observable<WishList[]>;
  public otherList$: Observable<WishList[]>;
  public myListCount$: Observable<number>;
  public otherListCount$: Observable<number>;
  public loading$: Observable<boolean>;
  public activeList$: Observable<string>;
  public notifsCount$: Observable<number>;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private wishesListQuery: WishesListQuery,
    private auth: AuthService,
    private notificationsQuery: NotificationsQuery,
    private router: Router
  ) {}

  ngOnInit() {
    this.userAuth$ = this.auth.user;
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

    this.activeList$ = this.wishesListQuery.selectActiveId();

    this.notifsCount$ = this.notificationsQuery.selectCount();
  }

  connect() {
    this.auth.openLoginPopUp();
  }

  logout() {
    this.auth.logout();
  }

  trackByFn(index: number, item: WishList) {
    return item.name;
  }

  @debounce(100)
  closeNotifications(notifs) {
    notifs.close();
  }

  goToList($event) {
    this.router.navigate(["/", $event.option.value]);
  }
}
