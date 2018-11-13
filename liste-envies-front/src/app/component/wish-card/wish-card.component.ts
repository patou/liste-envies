import { Component, Input, OnInit } from "@angular/core";
import { WishItem } from "../../models/WishItem";
import { SwiperConfigInterface } from "ngx-swiper-wrapper";
import { WishEditComponent } from "../wish-edit/wish-edit.component";
import { MatDialog } from "@angular/material";
import { transition, trigger, useAnimation } from "@angular/animations";
import { WishListApiService } from "../../service/wish-list-api.service";
import { bounceInUp } from "ng-animate";
import { WishService } from "../../state/wishes/wish.service";

@Component({
  selector: "app-wish-card",
  templateUrl: "./wish-card.component.html",
  styleUrls: ["./wish-card.component.scss"],
  animations: [
    trigger("animateWishCard", [transition("* => *", useAnimation(bounceInUp))])
  ]
})
export class WishCardComponent implements OnInit {
  animateWishCard: any;

  @Input() public wishItem: WishItem;
  edit = false;

  public SWIPER_CONFIG: SwiperConfigInterface = {
    direction: "horizontal",
    slidesPerView: 1,
    navigation: true,
    // effect: 'cube',
    lazy: true,
    // parallax: true,
    pagination: { el: ".swiper-pagination", type: "bullets", clickable: true }
    // cubeEffect: {
    //   slideShadows: false,
    // }
  };

  constructor(
    public dialog: MatDialog,
    public wishApi: WishListApiService,
    private wishService: WishService
  ) {}

  ngOnInit() {}

  editWish() {
    this.dialog
      .open(WishEditComponent, {
        width: "auto",
        height: "auto",
        maxHeight: "90%",
        maxWidth: "100%",
        panelClass: "matDialogContent",
        data: this.wishItem
      })
      .afterClosed()
      .subscribe((result: WishItem) => {
        console.log("The dialog was closed");
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

  headerClass() {
    if (this.wishItem.given) {
      return "header-danger";
    }
    if (this.wishItem.allreadyGiven) {
      return "header-warning";
    }
    if (this.wishItem.suggest) {
      return "header-info";
    }
    return "header-success";
  }

  give() {
    this.wishService.give(this.wishItem.id, this.wishItem);
  }

  sendComment(value: string) {
    this.wishService.comment(this.wishItem.listId, this.wishItem.id, {
      text: value
    });
  }
}
