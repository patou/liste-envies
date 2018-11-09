import { Injectable } from "@angular/core";
import { QueryEntity } from "@datorama/akita";
import { WishStore, WishState } from "./wish.store";
import { Wish } from "./wish.model";

@Injectable({
  providedIn: "root"
})
export class WishQuery extends QueryEntity<WishState, Wish> {
  constructor(protected store: WishStore) {
    super(store);
  }
}
