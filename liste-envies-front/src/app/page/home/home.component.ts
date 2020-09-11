import {Component, OnDestroy, OnInit} from "@angular/core";
import { Observable } from "rxjs/Observable";
import { WishList } from "../../models/WishList";
import * as firebase from "firebase";
import { AuthService } from "../../service/auth.service";
import { WishesListQuery } from "../../state/wishes/wishes-list.query";
import {ColorManagementService} from '../../service/color-management.service';
import {BreakpointObserver, Breakpoints, BreakpointState} from "@angular/cdk/layout";
import {untilDestroyed} from "ngx-take-until-destroy";
import {map} from "rxjs/operators";

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

  constructor(
    private wishListService: WishesListQuery,
    private breakpointObserver: BreakpointObserver,
    private auth: AuthService,
    private colorManagementService: ColorManagementService
  ) {
    this.column$ = this.breakpointObserver.observe([Breakpoints.Small, Breakpoints.Medium, Breakpoints.Large, Breakpoints.XLarge])
      .pipe(untilDestroyed(this), map((result: BreakpointState) => {
        console.log('breackpoints :', result);
        const breakpoints = result.breakpoints;
        if (breakpoints[Breakpoints.XLarge]) { return 4}
        if (breakpoints[Breakpoints.Large]) { return 3}
        if (breakpoints[Breakpoints.Medium]) { return 2}
        if (breakpoints[Breakpoints.Small]) { return 1}
      }));
  }

  ngOnInit() {
    this.colorManagementService.applyDefaultColor();
    this.userAuth = this.auth.user;
    this.list$ = this.wishListService.selectAll();
    this.loading$ = this.wishListService.selectLoading();
  }

  newList() {}

  connect() {
    this.auth.openLoginPopUp();
  }

  ngOnDestroy(): void {
  }
}
