import { Injectable } from "@angular/core";
import { Order, QueryConfig, QueryEntity } from "@datorama/akita";
import { WishStore, WishState } from "./wish.store";
import { WishItem } from "../../models/WishItem";

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
}
