import { Injectable } from "@angular/core";
import { ID, Order, QueryConfig, QueryEntity } from "@datorama/akita";
import { WishStore, WishState } from "./wish.store";
import { WishItem } from "../../models/WishItem";
import { distinct, map } from "rxjs/operators";
import { Observable } from "rxjs/Observable";

@Injectable({
  providedIn: "root"
})
@QueryConfig({
  sortBy: "date",
  sortByOrder: Order.DESC
})
export class WishQuery extends QueryEntity<WishState, WishItem> {
  constructor(protected store: WishStore) {
    super(store);
  }

  selectIsActive(id: ID): Observable<boolean> {
    return this.selectActiveId().pipe(
      distinct(),
      map<ID, boolean>((currentId: ID) => currentId === id)
    );
  }
}
