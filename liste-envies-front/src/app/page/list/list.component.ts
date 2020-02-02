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
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "../../service/auth.service";
import * as firebase from "firebase";
import { WishEditComponent } from "../../component/wish-edit/wish-edit.component";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { WishQuery } from "../../state/wishes/wish.query";
import {distinct, distinctUntilKeyChanged, map, skip, tap} from "rxjs/operators";
import { WishService } from "../../state/wishes/wish.service";
import { DemoService } from "../../state/wishes/demo/demo.service";
import { DemoQuery } from "../../state/wishes/demo/demo.query";
import { untilDestroyed } from "ngx-take-until-destroy";
import { ColorManagementService } from "../../service/color-management.service";
import { WishesListService } from "../../state/wishes/wishes-list.service";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";

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
  expandedHeader: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map(result => !result.matches)
    );

  constructor(
    private wishService: WishService,
    private wishListApiService: WishListApiService,
    private demoWishService: DemoService,
    private demoWishQuery: DemoQuery,
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService,
    public dialog: MatDialog,
    private wishQuery: WishQuery,
    private wishesListService: WishesListService,
    private colorManagementService: ColorManagementService,
    private snackBar: MatSnackBar,
    private breakpointObserver: BreakpointObserver
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
    this.whishList$
      .pipe(
        distinct(),
        tap(wishList => {
          this.list = wishList;
        }),
        distinctUntilKeyChanged("picture")
      )
      .subscribe(() => {
        this.colorManagementService.setColorFromUrl(this.getUrlImage());
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
    return `url(${this.getUrlImage()})`;
  }

  getUrlImage() {
    if (
      this.list &&
      this.list.picture &&
      this.list.picture.startsWith("http")
    ) {
      return this.list.picture;
    } else if (this.list && this.list.picture) {
      return `assets/${this.list.picture}`;
    }
    return "assets/img/default.jpg";
  }

  archiveList() {
    // todo add a confirm dialog.
    this.wishesListService.archiveWishList(this.list.name).subscribe(
      value => {
        this.snackBar.open(`Votre liste ${this.list.name} a été archivé `);
        this.router.navigate(["/"]);
      },
      error => {
        console.error(error);
        this.snackBar.open(
          `Erreur de l'archivage de la liste ${this.list.name}`
        );
      }
    );
  }

  ngOnDestroy(): void {}
}
