import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { WishList } from "../../models/WishList";
import * as firebase from "firebase";
import { AuthService } from "../../service/auth.service";
import { WishesListQuery } from "../../state/wishes/wishes-list.query";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  public userAuth: Observable<firebase.User>;

  private list$: Observable<WishList[]>;
  private loading$: Observable<boolean>;

  constructor(
    private wishListService: WishesListQuery,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.userAuth = this.auth.user;
    this.list$ = this.wishListService.selectAll();
    this.loading$ = this.wishListService.selectLoading();
  }

  newList() {}

  connect() {
    this.auth.openLoginPopUp();
  }
}
