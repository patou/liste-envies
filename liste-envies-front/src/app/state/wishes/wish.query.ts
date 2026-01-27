import { Injectable } from "@angular/core";
import { ID, Order, QueryConfig, QueryEntity } from "@datorama/akita";
import { WishStore, WishState } from "./wish.store";
import { distinct, map } from "rxjs/operators";
import { Observable } from "rxjs";
import { WishList } from "../../models/WishList";

@Injectable({
  providedIn: "root"
})
@QueryConfig({
  sortBy: "date",
  sortByOrder: Order.DESC
})
export class WishQuery extends QueryEntity<WishState> {
  constructor(protected store: WishStore) {
    super(store);
  }

  selectIsActive(id: ID): Observable<boolean> {
    return this.selectActiveId().pipe(
      distinct(),
      map<ID, boolean>((currentId: ID) => currentId === id)
    );
  }

  selectWish() {
    return this.select().pipe(map((state: WishState) => state.wishList));
  }

  isFullWishListLoaded(): boolean {
    return this.getValue().ui.loaded.full;
  }

  isToOfferListLoaded(): boolean {
    return this.getValue().ui.loaded.toOffer;
  }

  isArchiveListLoaded(): boolean {
    return this.getValue().ui.loaded.archive;
  }
}
