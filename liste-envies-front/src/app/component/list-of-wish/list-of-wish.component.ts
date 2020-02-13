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

  @Input()
  public demo: boolean;

  constructor(
    public dialog: MatDialog,
    public wishApi: WishListApiService,
    public wishService: WishService,
    public wishQuery: WishQuery,
    public demoQuery: DemoQuery
  ) {}

  ngOnInit() {
    this.splitObservable();
  }

  ngOnChanges(changes: SimpleChanges): void {}

  trackByFn(index: number, item: WishItem) {
    return item.id;
  }

  trackColumn(index: number, item: WishItem) {
    return index;
  }

  private splitObservable() {
    if (this.demo) {
      this.columns = [];
      for (let i = 0; i < this.nbrColumns; i++) {
        this.columns[i] = this.demoQuery.selectAll({
          filterBy: (wish: WishItem, index: number) =>
            index % this.nbrColumns === i
        });
      }
    } else {
      this.columns = [];
      for (let i = 0; i < this.nbrColumns; i++) {
        this.columns[i] = (this.wishService.selectAllByFilters({
          filterBy: (wish: WishItem, index: number) =>
            index % this.nbrColumns === i
        }) as Observable<WishItem[]>);
      }
    }
  }
}
