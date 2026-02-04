import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { map, tap, debounceTime } from "rxjs/operators";
import { AuthService } from "../../service/auth.service";
import type { User } from "firebase/auth";
import { Observable } from "rxjs";
import { WishesListQuery } from "../../state/wishes/wishes-list.query";
import { WishList } from "../../models/WishList";
import { NotificationsQuery } from "../../state/app/notifications.query";
import {
  UntypedFormControl,
  FormsModule,
  ReactiveFormsModule
} from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { WishesListService } from "../../state/wishes/wishes-list.service";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { Debounce as DebounceDecorator } from "lodash-decorators";
import { ID } from "@datorama/akita";
import { MyWishQuery } from "../../state/wishes/my-wish/my-wish.query";
import { LoginPopUpService } from "../../service/login-pop-up.service";
import {
  MatSidenavContainer,
  MatSidenav,
  MatSidenavContent
} from "@angular/material/sidenav";
import { MatToolbar } from "@angular/material/toolbar";
import { MatIconButton, MatButton } from "@angular/material/button";
import { MatTooltip } from "@angular/material/tooltip";
import { MatIcon } from "@angular/material/icon";
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from "@angular/material/expansion";
import { MatBadge } from "@angular/material/badge";
import { MatNavList, MatDivider } from "@angular/material/list";
import { WishListNavItemComponent } from "../../shared/wish-list-nav-item/wish-list-nav-item.component";
import { MatMenuItem, MatMenuTrigger, MatMenu } from "@angular/material/menu";
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { MatFormField, MatInput } from "@angular/material/input";
import {
  MatAutocompleteTrigger,
  MatAutocomplete,
  MatOptgroup,
  MatOption
} from "@angular/material/autocomplete";
import { ListTypeIcon } from "../../shared/list-type-icon/list-type-icon.component";
import { AvatarComponent } from "../../shared/avatar/avatar.component";
import { PageFooterComponent } from "../../shared/page-footer/page-footer.component";
import {
  MatTabGroup,
  MatTab,
  MatTabLabel,
  MatTabContent
} from "@angular/material/tabs";
import { NotificationsComponent } from "../notifications/notifications.component";
import { SideOfWishComponent } from "../side_of_wish/side-of-wish.component";
import { AsyncPipe } from "@angular/common";

interface LinkMenuItem {
  icon?: string;
  text?: string;
  callback?: () => void;
}

@UntilDestroy()
@Component({
  selector: "app-page-nav",
  templateUrl: "./page-nav.component.html",
  styleUrls: ["./page-nav.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatSidenavContainer,
    MatSidenav,
    MatToolbar,
    MatIconButton,
    MatTooltip,
    RouterLink,
    MatIcon,
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    MatBadge,
    MatNavList,
    WishListNavItemComponent,
    MatMenuItem,
    MatProgressSpinner,
    MatSidenavContent,
    MatFormField,
    MatInput,
    MatAutocompleteTrigger,
    FormsModule,
    ReactiveFormsModule,
    MatAutocomplete,
    MatOptgroup,
    MatOption,
    ListTypeIcon,
    AvatarComponent,
    MatMenuTrigger,
    MatMenu,
    MatDivider,
    MatButton,
    PageFooterComponent,
    MatTabGroup,
    MatTab,
    MatTabLabel,
    MatTabContent,
    NotificationsComponent,
    SideOfWishComponent,
    AsyncPipe
  ]
})
export class PageNavComponent implements OnInit {
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      tap(ishandset => (this.isHandset = ishandset))
    );

  isHandset: boolean;

  public user$: Observable<User | null>;
  public userAuth$: Observable<User | null>;

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

  public selectListControl = new UntypedFormControl("");
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
    this.user$ = this.auth.user;
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

  signOut() {
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
