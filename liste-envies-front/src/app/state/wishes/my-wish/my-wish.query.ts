import { Injectable } from "@angular/core";
import { Order, QueryConfig, QueryEntity } from "@datorama/akita";
import { MyWishState, MyWishStore } from "./my-wish.store";
import { Observable } from "rxjs";
import { WishItem, WishItemState } from "../../../models/WishItem";

@Injectable({
  providedIn: "root"
})
@QueryConfig({
  sortBy: "date",
  sortByOrder: Order.DESC
})
export class MyWishQuery extends QueryEntity<MyWishState> {
  constructor(protected store: MyWishStore) {
    super(store);
  }

  public countBasket(): Observable<number> {
    return this.selectCount(
      value => value.state === WishItemState.ACTIVE && value.userGiven
    );
  }

  public countArchive(): Observable<number> {
    return this.selectCount(value => value.state === WishItemState.ARCHIVED);
  }

  public countTrash(): Observable<number> {
    return this.selectCount(value => value.state === WishItemState.DELETED);
  }

  public selectForType(
    type: "BASKET" | "ARCHIVE" | "TRASH"
  ): Observable<WishItem[]> {
    let find;
    switch (type) {
      case "BASKET":
        find = value => value.state === WishItemState.ACTIVE && value.userGiven;
        break;
      case "ARCHIVE":
        find = value => value.state === WishItemState.ARCHIVED;
        break;
      case "TRASH":
        find = value => value.state === WishItemState.DELETED;
        break;
    }

    return this.selectAll({ filterBy: find });
  }
}
