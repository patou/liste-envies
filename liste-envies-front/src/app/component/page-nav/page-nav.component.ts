import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { map, tap, debounceTime } from "rxjs/operators";
import { AuthService } from "../../service/auth.service";
import * as firebase from "firebase";
import { Observable } from "rxjs";
import { WishesListQuery } from "../../state/wishes/wishes-list.query";
import { WishList } from "../../models/WishList";
import { NotificationsQuery } from "../../state/app/notifications.query";
import { FormControl } from "@angular/forms";
import { Router } from "@angular/router";
import { WishesListService } from "../../state/wishes/wishes-list.service";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { Debounce as DebounceDecorator } from "lodash-decorators";
import { ID } from "@datorama/akita";
import { MyWishQuery } from "../../state/wishes/my-wish/my-wish.query";
import { LinkMenuItem } from "ngx-auth-firebaseui";
import { LoginPopUpService } from "../../service/login-pop-up.service";

@UntilDestroy()
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
  public activeList$: Observable<ID>;
  public notifsCount$: Observable<number>;
  public basketCount$: Observable<number>;
  public archiveCount$: Observable<number>;
  public trashCount$: Observable<number>;

  public selectListControl = new FormControl("");
  public isOpened: boolean = false;
  public openedRightSideNav: boolean = false;
  public selectedTabsRightSidebar: number = 0;
  public links: LinkMenuItem[] = [
    {
      icon: "info",
      text: "En savoir plus",
      callback: () => this.goToAboutPage()
    }
  ];

  constructor(
    private breakpointObserver: BreakpointObserver,
    private wishesListQuery: WishesListQuery,
    private wishListService: WishesListService,
    private auth: AuthService,
    private notificationsQuery: NotificationsQuery,
    private router: Router,
    private myWishQuery: MyWishQuery,
    private loginPopUp: LoginPopUpService
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
      .pipe(untilDestroyed(this), debounceTime(250))
      .subscribe(value => {
        if (typeof value === "string") {
          this.wishListService.searchList(value);
        } else {
          this.wishListService.searchList("");
        }
      });

    this.basketCount$ = this.myWishQuery.countBasket();
    this.archiveCount$ = this.myWishQuery.countArchive();
    this.trashCount$ = this.myWishQuery.countTrash();
  }

  connect() {
    this.loginPopUp.openLoginPopUp().subscribe(result => {});
  }

  logout() {
    this.auth.logout();
  }

  goToAboutPage() {
    this.router.navigateByUrl("/about");
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

  openRightSidePanel(selectedTabs: number) {
    this.selectedTabsRightSidebar = selectedTabs;
    this.openedRightSideNav = true;
  }

  closeRightSidePanel() {
    this.openedRightSideNav = false;
  }
}
