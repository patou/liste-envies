import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges
} from "@angular/core";

import { WishListApiService } from "../../service/wish-list-api.service";
import { Observable } from "rxjs";
import { WishList } from "../../models/WishList";
import { WishItem } from "../../models/WishItem";
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive
} from "@angular/router";
import { AuthService } from "../../service/auth.service";
import type { User } from "firebase/auth";
import { WishEditComponent } from "../../component/wish-edit/wish-edit.component";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { WishQuery } from "../../state/wishes/wish.query";
import {
  distinct,
  distinctUntilKeyChanged,
  map,
  skip,
  tap
} from "rxjs/operators";
import { WishService } from "../../state/wishes/wish.service";
import { DemoService } from "../../state/wishes/demo/demo.service";
import { DemoQuery } from "../../state/wishes/demo/demo.query";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { ColorManagementService } from "../../service/color-management.service";
import { WishesListService } from "../../state/wishes/wishes-list.service";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { MatMenu, MatMenuItem, MatMenuTrigger } from "@angular/material/menu";
import { MatIcon } from "@angular/material/icon";
import { MatTooltip } from "@angular/material/tooltip";
import {
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
  MatExpansionPanelActionRow
} from "@angular/material/expansion";
import { ListTypeIcon } from "../../shared/list-type-icon/list-type-icon.component";
import {
  MatCardAvatar,
  MatCard,
  MatCardHeader,
  MatCardTitle,
  MatCardSubtitle,
  MatCardContent
} from "@angular/material/card";
import {
  MatIconAnchor,
  MatIconButton,
  MatFabButton
} from "@angular/material/button";
import { AvatarComponent } from "../../shared/avatar/avatar.component";
import { ReadMoreComponent } from "../../shared/read-more/read-more.component";
import { WishFiltersFormComponent } from "../../component/wish-filters-form/wish-filters-form.component";
import { MatTabNav, MatTabLink } from "@angular/material/tabs";
import { MatBadge } from "@angular/material/badge";
import { ListOfWishComponent } from "../../component/list-of-wish/list-of-wish.component";
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { AsyncPipe } from "@angular/common";
import { MomentModule } from "ngx-moment";

@UntilDestroy()
@Component({
  selector: "app-list",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatMenu,
    MatMenuItem,
    RouterLink,
    MatIcon,
    MatTooltip,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    ListTypeIcon,
    MatCardAvatar,
    MatIconAnchor,
    AvatarComponent,
    MatIconButton,
    MatMenuTrigger,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardSubtitle,
    MatCardContent,
    ReadMoreComponent,
    MatExpansionPanelActionRow,
    WishFiltersFormComponent,
    MatTabNav,
    MatTabLink,
    RouterLinkActive,
    MatBadge,
    ListOfWishComponent,
    MatProgressSpinner,
    MatFabButton,
    AsyncPipe,
    MomentModule
  ]
})
export class ListComponent implements OnInit, OnChanges {
  listItems: Observable<WishItem[]>;

  whishList$: Observable<WishList>;

  loading$: Observable<boolean>;

  backgroundImage: string;

  @Input()
  list: WishList;

  @Input()
  items: Observable<WishItem[]>;

  @Input()
  demo = false;

  public userAuth: Observable<User | null>;
  expandedHeader: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map(result => !result.matches));

  public headerOpened: boolean;

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
        })
      )
      .subscribe(() => {
        let backgroundImageTemp = this.listBackgroundImg();
        if (backgroundImageTemp !== this.backgroundImage) {
          this.backgroundImage = backgroundImageTemp;
          this.colorManagementService.setColorFromUrl(this.getUrlImage());
        }
      });

    this.listItems = this.wishQuery.selectAll();
    this.loading$ = this.wishQuery.selectLoading();

    this.userAuth.pipe(skip(1), untilDestroyed(this)).subscribe(value => {
      if (value) {
        this.refreshList();
      }
    });
  }

  public refreshList() {
    if (this.demo) return;
    this.wishService.refreshList(
      this.route.snapshot.url.join(""),
      this.route.snapshot.params["listId"]
    );
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

  onClickTabGive(event, isActive) {
    /*if (!isActive) {
      this.wishService.displayActive();
    }*/
  }

  onClickTabArchive(event, isActive) {
    /*if (!isActive) {
      this.wishService.displayArchive();
    }*/
  }

  doNothing(event) {
    event.preventDefault();
    event.stopPropagation();
    return false;
  }
}
