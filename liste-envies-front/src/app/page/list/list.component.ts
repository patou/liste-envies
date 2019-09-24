import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnDestroy,
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
import { WishEditComponent } from "../../component/wish-edit/wish-edit.component";
import { MatDialog } from "@angular/material";
import { WishQuery } from "../../state/wishes/wish.query";
import { skip } from "rxjs/operators";
import { WishService } from "../../state/wishes/wish.service";
import { DemoService } from "../../state/wishes/demo/demo.service";
import { DemoQuery } from "../../state/wishes/demo/demo.query";
import { untilDestroyed } from "ngx-take-until-destroy";

@Component({
  selector: "app-list",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListComponent implements OnInit, OnChanges, OnDestroy {
  listItems: Observable<WishItem[]>;

  whishList$: Observable<WishList>;

  loading$: Observable<boolean>;

  @Input()
  list: WishList;

  @Input()
  items: Observable<WishItem[]>;

  @Input()
  demo = false;

  public userAuth: Observable<firebase.User>;


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

    this.whishList$ = this.wishQuery.selectWish();
    this.whishList$.subscribe(wishList => {
      this.list = wishList;
    });

    this.listItems = this.wishQuery.selectAll();
    this.loading$ = this.wishQuery.selectLoading();

    this.userAuth
      .pipe(
        skip(1),
        untilDestroyed(this)
      )
      .subscribe(value => {
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
          this.wishService.add(this.route.snapshot.params["listId"], result);
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

  ngOnDestroy(): void {}
}
