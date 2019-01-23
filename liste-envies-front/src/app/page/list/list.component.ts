import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges
} from "@angular/core";

import { WishListApiService } from "../../service/wish-list-api.service";
import { Observable } from "rxjs/Observable";
import { WishList } from "../../models/WishList";
import { WishItem } from "../../models/WishItem";
import { ActivatedRoute } from "@angular/router";
import { AuthService } from "../../service/auth.service";
import * as firebase from "firebase";
import { RouteData, RouteParams } from "angular-xxl";
import { WishEditComponent } from "../../component/wish-edit/wish-edit.component";
import { MatDialog } from "@angular/material";
import { WishQuery } from "../../state/wishes/wish.query";
import { pluck } from "rxjs/operators";
import { WishState } from "../../state/wishes/wish.store";
import { WishService } from "../../state/wishes/wish.service";
import { DemoService } from "../../state/wishes/demo/demo.service";
import { DemoQuery } from "../../state/wishes/demo/demo.query";

@Component({
  selector: "app-list",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListComponent implements OnInit, OnChanges {
  listItems: Observable<WishItem[]>;

  whishList$: Observable<WishList>;

  loading$: Observable<boolean>;

  @Input("list")
  list: WishList;

  @Input("items")
  items: Observable<WishItem[]>;

  @Input("demo")
  demo = false;

  public userAuth: Observable<firebase.User>;

  @RouteParams("listId", { observable: false }) public listId: string;

  constructor(
    private wishService: WishService,
    private wishListApiService: WishListApiService,
    private demoWishService: DemoService,
    private demoWishQuery: DemoQuery,
    private route: ActivatedRoute,
    private auth: AuthService,
    public dialog: MatDialog,
    private wishQuery: WishQuery
  ) {}

  ngOnInit() {
    this.userAuth = this.auth.user;

    if (this.demo) {
      this.listItems = this.demoWishQuery.selectAll();
      this.loading$ = this.demoWishQuery.selectLoading();

      return;
    }
    // if no demo, do the following

    this.whishList$ = this.wishQuery
      .select()
      .pipe(pluck<WishState, WishList>("wishList"));
    this.whishList$.subscribe(wishList => {
      this.list = wishList;
    });

    this.listItems = this.wishQuery.selectAll();
    this.loading$ = this.wishQuery.selectLoading();

    this.userAuth.subscribe(value => {
      this.loadList();
    });
  }

  private loadList() {
    if (this.demo) return;

    this.wishService.get(this.route.snapshot.params["listId"], false);
  }

  addWish() {
    if (this.demo) return;

    this.dialog
      .open(WishEditComponent, {
        width: "auto",
        height: "auto",
        maxHeight: "90%",
        maxWidth: "100%",
        panelClass: "matDialogContent"
      })
      .afterClosed()
      .subscribe((result: WishItem) => {
        if (result) {
          this.wishService.add(this.listId, result);
        }
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.list && changes.list.currentValue) {
      this.whishList$ = changes.list.currentValue;
    }
  }

  listBackgroundImg() {
    if (
      this.list &&
      this.list.picture &&
      this.list.picture.startsWith("http")
    ) {
      return "url(" + this.list.picture + ")";
    } else if (this.list && this.list.picture) {
      return "url(assets/" + this.list.picture + ")";
    }
    return "url(assets/img/default.jpg)";
  }
}
