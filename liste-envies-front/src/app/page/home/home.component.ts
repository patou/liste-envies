import { Component, Inject, OnInit } from "@angular/core";
import { WishList } from "../../models/WishList";
import * as firebase from "firebase";
import { AuthService } from "../../service/auth.service";
import { WishesListQuery } from "../../state/wishes/wishes-list.query";
import { ColorManagementService } from "../../service/color-management.service";
import { Observable } from "rxjs";
import { AUTH_PROVIDERS } from "../../shared/auth_providers";
import { AuthProvider } from "ngx-auth-firebaseui";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  public userAuth: Observable<firebase.User>;

  private list$: Observable<WishList[]>;
  public loading$: Observable<boolean>;

  constructor(
    private wishListService: WishesListQuery,
    private auth: AuthService,
    private colorManagementService: ColorManagementService,
    @Inject(AUTH_PROVIDERS) public providers: AuthProvider[]
  ) {}

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
}
