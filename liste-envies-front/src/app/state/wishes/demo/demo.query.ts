import { Injectable } from "@angular/core";
import { Order, QueryConfig, QueryEntity } from "@datorama/akita";
import { DemoStore, DemoState } from "./demo.store";
import { WishItem } from "../../../models/WishItem";

@Injectable({
  providedIn: "root"
})
@QueryConfig({
  sortBy: "date",
  sortByOrder: Order.DESC
})
export class DemoQuery extends QueryEntity<DemoState, WishItem> {
  constructor(protected store: DemoStore) {
    super(store);
  }
}
