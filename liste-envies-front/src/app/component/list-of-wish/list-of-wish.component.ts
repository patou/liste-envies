import {
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
import { map, switchMap, tap } from "rxjs/operators";

declare var Macy;

@Component({
  selector: "app-list-of-wish",
  templateUrl: "./list-of-wish.component.html",
  styleUrls: ["./list-of-wish.component.scss"]
  /* animations: [
    trigger("animateColumn", [transition("* => *", useAnimation(fadeInUp))]),
    trigger("animateItems", [transition("* => *", useAnimation(bounceInLeft))])
  ]*/
})
export class ListOfWishComponent implements OnInit, OnChanges {
  animateItems: any;
  animateColumn: any;

  @Input() public list: Observable<WishItem[]>;

  @Input()
  public nbrColumns = 3;
  public columns: Observable<WishItem[][]>;

  constructor(public dialog: MatDialog, public wishApi: WishListApiService) {}

  ngOnInit() {
    console.log("On init wishItems ", this.list);

    this.splitObservable();
  }

  private splitObservable() {
    this.columns = this.list.pipe(
      map<WishItem[], WishItem[][]>((wishItems: WishItem[]) => {
        const filteredWishList: WishItem[][] = [];
        console.log("Pipe : ", this.nbrColumns);
        for (let i = 0; i < this.nbrColumns; i++) {
          console.log("Pipe Column : ", i);
          const items = wishItems.reduce(
            (filteredWish: WishItem[], wishItem: WishItem, index: number) => {
              if (index % this.nbrColumns === i) {
                filteredWish.push(wishItem);
              }
              return filteredWish;
            },
            []
          );
          filteredWishList.push(items);
          console.log("columns : ", i, items);
        }
        return filteredWishList;
      }),
      tap((items: WishItem[][]) => {
        console.log("Items : ", items);
      })
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    this.splitObservable();
    /*if (changes.list && changes.list.currentValue) {
      this.columns = changes.list.currentValue.reduce(
        (acc, val, index) => {
          acc[index % acc.length].push(val);
          return acc;
        },
        Array(this.nbrColumns)
          .fill(0)
          .map(() => [])
      );
    }*/
  }
}
