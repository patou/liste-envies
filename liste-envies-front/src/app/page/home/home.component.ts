import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { WishList } from "../../models/WishList";
import * as firebase from "firebase";
import { AuthService } from "../../service/auth.service";
import { WishesListQuery } from "../../state/wishes/wishes-list.query";
import { ColorManagementService } from "../../service/color-management.service";
import { Observable } from "rxjs";
import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState
} from "@angular/cdk/layout";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { map } from "rxjs/operators";
import { AUTH_PROVIDERS } from "../../shared/auth_providers";
import { AuthProvider, Theme } from "ngx-auth-firebaseui";
import { LoginPopUpService } from "../../service/login-pop-up.service";
import { WishesListService } from "../../state/wishes/wishes-list.service";

@UntilDestroy()
@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit, OnDestroy {
  public userAuth: Observable<firebase.User>;

  private list$: Observable<WishList[]>;
  public loading$: Observable<boolean>;
  public column$: Observable<number>;
  theme: Theme = Theme.RAISED;

  constructor(
    private wishesListQuery: WishesListQuery,
    private wishesListService: WishesListService,
    private breakpointObserver: BreakpointObserver,
    private auth: AuthService,
    private colorManagementService: ColorManagementService,
    @Inject(AUTH_PROVIDERS) public providers: AuthProvider[],
    private loginPopUp: LoginPopUpService
  ) {
    this.column$ = this.breakpointObserver
      .observe([
        Breakpoints.Small,
        Breakpoints.Medium,
        Breakpoints.Large,
        Breakpoints.XLarge
      ])
      .pipe(
        untilDestroyed(this),
        map((result: BreakpointState) => {
          const breakpoints = result.breakpoints;
          if (breakpoints[Breakpoints.XLarge]) {
            return 4;
          }
          if (breakpoints[Breakpoints.Large]) {
            return 3;
          }
          if (breakpoints[Breakpoints.Medium]) {
            return 2;
          }
          if (breakpoints[Breakpoints.Small]) {
            return 1;
          }
        })
      );
  }

  ngOnInit() {
    this.colorManagementService.applyDefaultColor();
    this.userAuth = this.auth.user;
    this.list$ = this.wishesListQuery.selectAll();
    this.loading$ = this.wishesListQuery.selectLoading();

    this.wishesListService.getWishListsIfNotLoaded();
  }

  newList() {}

  connect() {
    this.loginPopUp.openLoginPopUp().subscribe(result => {});
  }

  ngOnDestroy(): void {}
}
