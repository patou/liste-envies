import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  ViewChild
} from "@angular/core";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { map, tap, debounceTime } from "rxjs/operators";
import { AuthService } from "../../service/auth.service";
import * as firebase from "firebase";
import { Observable } from "rxjs/Observable";
import { WishesListQuery } from "../../state/wishes/wishes-list.query";
import { WishList } from "../../models/WishList";
import { NotificationsService } from "../../state/app/notifications.service";
import { NotificationsQuery } from "../../state/app/notifications.query";
import { MatDrawer } from "@angular/material";
import { FormControl } from "@angular/forms";
import { Router } from "@angular/router";
import { WishesListService } from "../../state/wishes/wishes-list.service";
import { untilDestroyed } from "ngx-take-until-destroy";
import { Debounce as DebounceDecorator } from "lodash-decorators";
import { ID } from "@datorama/akita";
import { WishItem } from "../../models/WishItem";

@Component({
  selector: "app-page-nav",
  templateUrl: "./page-nav.component.html",
  styleUrls: ["./page-nav.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageNavComponent implements OnInit, OnDestroy {
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
  public activeList$: Observable<ID>;
  public notifsCount$: Observable<number>;

  public selectListControl = new FormControl("");
  public isOpened: boolean = false;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private wishesListQuery: WishesListQuery,
    private wishListService: WishesListService,
    private auth: AuthService,
    private notificationsQuery: NotificationsQuery,
    private router: Router
  ) {}

  ngOnInit() {
    this.userAuth$ = this.auth.user;
    this.myList$ = this.wishListService.selectAllByFilters({
      filterBy: list => list.owner
    }) as Observable<WishList[]>;
    this.myListCount$ = this.wishesListQuery.selectCount(list => list.owner);
    this.otherList$ = this.wishListService.selectAllByFilters({
      filterBy: list => !list.owner
    }) as Observable<WishList[]>;
    this.otherListCount$ = this.wishesListQuery.selectCount(
      list => !list.owner
    );
    this.loading$ = this.wishesListQuery.selectLoading();

    this.activeList$ = this.wishesListQuery.selectActiveId();

    this.notifsCount$ = this.notificationsQuery.selectCount();

    this.selectListControl.valueChanges
      .pipe(
        untilDestroyed(this),
        debounceTime(250)
      )
      .subscribe(value => {
        this.wishListService.searchList(value);
      });
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

  @DebounceDecorator(100)
  closeNotifications(notifs) {
    notifs.close();
  }

  goToList($event) {
    this.isOpened = false;
    this.selectListControl.reset();
    this.router.navigate(["/", $event.option.value]);
  }

  ngOnDestroy() {}
}
