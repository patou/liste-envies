import { Injectable } from "@angular/core";
import { Order, QueryConfig, QueryEntity } from "@datorama/akita";
import { WishesListStore, WishesListState } from "./wishes-list.store";
import { WishList } from "../../models/WishList";

@Injectable({
  providedIn: "root"
})
@QueryConfig({
  sortBy: "title",
  sortByOrder: Order.ASC
})
export class WishesListQuery extends QueryEntity<WishesListState> {
  constructor(protected store: WishesListStore) {
    super(store);
  }
}
