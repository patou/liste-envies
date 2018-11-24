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
import { MatDialog } from "@angular/material";
import { WishListApiService } from "../../service/wish-list-api.service";
import { Observable } from "rxjs/Observable";
import { filter, map, switchMap, tap } from "rxjs/operators";
import { WishQuery } from "../../state/wishes/wish.query";

declare var Macy;

@Component({
  selector: "app-list-of-wish",
  templateUrl: "./list-of-wish.component.html",
  styleUrls: ["./list-of-wish.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger("animateColumn", [transition("* => *", useAnimation(fadeInUp))]),
    trigger("animateItems", [transition("* => *", useAnimation(bounceInLeft))])
  ]
})
export class ListOfWishComponent implements OnInit, OnChanges {
  animateItems: any;
  animateColumn: any;

  @Input() public list: Observable<WishItem[]>;

  @Input()
  public nbrColumns = 3;
  public columns: Observable<WishItem[]>[];

  constructor(
    public dialog: MatDialog,
    public wishApi: WishListApiService,
    public wishQuery: WishQuery
  ) {}

  ngOnInit() {
    this.splitObservable();
  }

  private splitObservable() {
    this.columns = [];
    for (let i = 0; i < this.nbrColumns; i++) {
      this.columns[i] = this.wishQuery.selectAll({
        filterBy: (wish: WishItem, index: number) =>
          index % this.nbrColumns === i
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {}

  trackByFn(index: number, item: WishItem) {
    return item.id;
  }

  trackColumn(index: number, item: WishItem) {
    return index;
  }
}
