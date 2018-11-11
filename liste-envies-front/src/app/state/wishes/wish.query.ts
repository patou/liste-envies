import { Injectable } from "@angular/core";
import { QueryEntity } from "@datorama/akita";
import { WishStore, WishState } from "./wish.store";
import { WishItem } from "../../models/WishItem";

@Injectable({
  providedIn: "root"
})
export class WishQuery extends QueryEntity<WishState, WishItem> {
  constructor(protected store: WishStore) {
    super(store);
  }
}
