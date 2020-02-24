import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges
} from "@angular/core";
import { WishItem } from "../../models/WishItem";
import { transition, trigger, useAnimation } from "@angular/animations";
import { bounceInLeft, fadeInUp } from "ng-animate";
import { MatDialog } from "@angular/material/dialog";
import { WishListApiService } from "../../service/wish-list-api.service";
import { Observable } from "rxjs/Observable";
import { WishQuery } from "../../state/wishes/wish.query";
import { DemoQuery } from "../../state/wishes/demo/demo.query";
import { WishService } from "../../state/wishes/wish.service";
import { UserAPIService } from "../../service/user-api.service";

declare var Macy;

@Component({
  selector: "app-side-of-wish",
  templateUrl: "./side-of-wish.component.html",
  styleUrls: ["./side-of-wish.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger("animateColumn", [transition("* => *", useAnimation(fadeInUp))]),
    trigger("animateItems", [transition("* => *", useAnimation(bounceInLeft))])
  ]
})
export class SideOfWishComponent implements OnInit {
  animateItems: any;
  animateColumn: any;

  @Input() typeWish: string;

  public list$: Observable<WishItem[]>;

  constructor(
    public dialog: MatDialog,
    public userApi: UserAPIService,
    public wishService: WishService,
    public wishQuery: WishQuery,
    public demoQuery: DemoQuery
  ) {}

  ngOnInit() {
    this.list$ = this.userApi.archived("me");
  }

  trackByFn(index: number, item: WishItem) {
    return item.id;
  }
}
