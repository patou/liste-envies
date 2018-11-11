import { Injectable } from "@angular/core";
import { QueryEntity } from "@datorama/akita";
import { WishesListStore, WishesListState } from "./wishes-list.store";
import { WishList } from "../../models/WishList";

@Injectable({
  providedIn: "root"
})
export class WishesListQuery extends QueryEntity<WishesListState, WishList> {
  constructor(protected store: WishesListStore) {
    super(store);
  }
}
