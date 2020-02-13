import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild
} from "@angular/core";
import { WishItem } from "../../models/WishItem";
import { SwiperConfigInterface } from "ngx-swiper-wrapper";
import { WishEditComponent } from "../wish-edit/wish-edit.component";
import { MatDialog } from "@angular/material/dialog";
import {
  animate,
  style,
  transition,
  trigger,
  useAnimation
} from "@angular/animations";
import { WishListApiService } from "../../service/wish-list-api.service";
import { bounceInUp } from "ng-animate";
import { WishService } from "../../state/wishes/wish.service";
import { WishQuery } from "../../state/wishes/wish.query";
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";

@Component({
  selector: "app-wish-card",
  templateUrl: "./wish-card.component.html",
  styleUrls: ["./wish-card.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger("animateWishCard", [
      transition("* => *", useAnimation(bounceInUp)),
      transition(":leave", [
        animate(
          "8s ease-out",
          style({ transform: "translateX(100%) scale(0)", opacity: 0 })
        )
      ])
    ])
  ]
})
export class WishCardComponent implements OnInit, OnChanges, OnDestroy {
  animateWishCard: any;

  public wishItem$: Observable<WishItem>;
  @Input() public wishItem: WishItem;

  @Input() readOnly: boolean;
  //@Input() public wishID: number;
  edit = false;

  public SWIPER_CONFIG: SwiperConfigInterface = {
    direction: "horizontal",
    slidesPerView: 1,
    navigation: true,
    lazy: true,
    grabCursor: true,
    centeredSlides: true,
    spaceBetween: 15,
    watchOverflow: false,
    centerInsufficientSlides: true,
    pagination: {
      el: ".swiper-pagination",
      type: "progressbar"
    },
    scrollbar: {
      el: ".swiper-scrollbar",
      draggable: true
    }
  };

  public index: number = 0;

  public addComment: string = "";

  public toolbar: [
    ["bold", "italic", "underline", "strike"], // toggled buttons
    ["blockquote"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["clean"], // remove formatting button
    ["link", "image", "video"] // link and image, video
  ];
  public commentExpanded: boolean = false;
  public isActive$: Observable<boolean>;

  constructor(
    public dialog: MatDialog,
    public wishApi: WishListApiService,
    public wishQuery: WishQuery,
    private wishService: WishService
  ) {}

  ngOnInit() {
    this.subscriveWish();
    this.isActive$ = this.wishService.selectIsActive(this.wishItem.id);
  }

  private subscriveWish() {
    /*if (this.wishID) {
      this.wishItem$ = this.wishQuery.selectEntity(this.wishID);
      // this.wishItem = this.wishQuery.getEntity(this.wishID);
    }*/
  }

  editWish(wishItem: WishItem) {
    this.dialog
      .open(WishEditComponent, {
        width: "auto",
        height: "auto",
        maxHeight: "90%",
        maxWidth: "100%",
        panelClass: "matDialogContent",
        data: wishItem
      })
      .afterClosed()
      .subscribe((result: WishItem) => {
        if (result) {
          this.wishService.update(result.id, result);
        } else {
          this.cancelEditWish();
        }
      });
  }

  cancelEditWish() {
    this.edit = false;
  }

  headerClass(wishItem: WishItem) {
    if (/*wishItem.canSuggest && */ wishItem.given) {
      return "header-danger";
    }
    if (/*wishItem.canSuggest && */ wishItem.allreadyGiven) {
      return "header-warning";
    }
    if (wishItem.canSuggest && wishItem.suggest) {
      return "header-info";
    }
    return "header-success";
  }

  give(wishItem: WishItem) {
    this.wishService.give(wishItem.id, wishItem);
  }

  archive(wishItem: WishItem) {
    this.wishService.archive(wishItem.id, wishItem);
  }

  remove(wishItem: WishItem) {
    this.wishService.remove(wishItem.id, wishItem);
  }

  sendComment(value: string, wishItem: WishItem) {
    this.addComment = "";
    this.wishService.comment(
      wishItem.listId,
      wishItem.id,
      {
        text: value
      },
      wishItem
    );
  }

  ngOnChanges(changes: SimpleChanges): void {}

  ngOnDestroy(): void {}
}
