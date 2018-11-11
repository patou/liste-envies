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

@Component({
  selector: "app-list",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListComponent implements OnInit, OnChanges {
  listItems: WishItem[];

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
    private wishListService: WishService,
    private wishListApiService: WishListApiService,
    private route: ActivatedRoute,
    private auth: AuthService,
    public dialog: MatDialog,
    private wishQuery: WishQuery
  ) {}

  ngOnInit() {
    this.userAuth = this.auth.user;

    if (this.demo) {
      this.items.subscribe((items: WishItem[]) => {
        console.log("items :", items);
        this.listItems = items;
      });
      return;
    }

    this.whishList$ = this.wishQuery
      .select()
      .pipe(pluck<WishState, WishList>("wishList"));
    this.wishQuery.selectAll().subscribe((items: WishItem[]) => {
      console.log("items :", items);
      this.listItems = items;
    });
    this.loading$ = this.wishQuery.selectLoading();

    // if no demo, do the following

    this.userAuth.subscribe(value => {
      this.loadList();
      console.log("user AUTH NEXT in list page / ", value);
    });
  }

  private loadList() {
    if (this.demo) return;

    this.wishListService.get(this.route.snapshot.params["listId"]);
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
        console.log("The dialog was closed");
        if (result) {
          this.wishListApiService
            .createWish(this.listId, result)
            .subscribe((Wish: WishItem) => {
              // todo juste add to list rather than reload all.
              this.loadList();
            });
        }
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log("On change :", changes);
    this.whishList$ = changes.list.currentValue;
  }
}
