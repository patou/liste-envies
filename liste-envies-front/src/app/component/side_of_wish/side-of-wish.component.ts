import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from "@angular/core";
import { WishItem } from "../../models/WishItem";
import { transition, trigger, useAnimation } from "@angular/animations";
import { bounceInLeft, fadeInUp } from "ng-animate";
import { MatDialog } from "@angular/material/dialog";
import { Observable } from "rxjs";
import { WishService } from "../../state/wishes/wish.service";
import { UserAPIService } from "../../service/user-api.service";
import { MyWishQuery } from "../../state/wishes/my-wish/my-wish.query";
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
  MatExpansionPanelDescription,
  MatExpansionPanelContent,
  MatExpansionPanelActionRow
} from "@angular/material/expansion";
import { WishCardComponent } from "../wish-card/wish-card.component";
import { MatAnchor } from "@angular/material/button";
import { RouterLink } from "@angular/router";
import { AsyncPipe } from "@angular/common";

@Component({
  selector: "app-side-of-wish",
  templateUrl: "./side-of-wish.component.html",
  styleUrls: ["./side-of-wish.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger("animateColumn", [transition("* => *", useAnimation(fadeInUp))]),
    trigger("animateItems", [transition("* => *", useAnimation(bounceInLeft))])
  ],
  imports: [
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    MatExpansionPanelDescription,
    MatExpansionPanelContent,
    WishCardComponent,
    MatExpansionPanelActionRow,
    MatAnchor,
    RouterLink,
    AsyncPipe
  ]
})
export class SideOfWishComponent implements OnInit {
  animateItems: any;
  animateColumn: any;

  @Input() typeWish: "BASKET" | "ARCHIVE" | "TRASH";

  public list$: Observable<WishItem[]>;

  constructor(
    public dialog: MatDialog,
    public userApi: UserAPIService,
    public wishService: WishService,
    private myWishService: MyWishQuery
  ) {}

  ngOnInit() {
    this.list$ = this.myWishService.selectForType(this.typeWish);
  }

  trackByFn(index: number, item: WishItem) {
    return item.id;
  }
}
