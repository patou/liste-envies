import { Injectable } from "@angular/core";
import { EntityState, EntityStore, StoreConfig } from "@datorama/akita";
import { WishList } from "../../models/WishList";

export interface WishesListState extends EntityState<WishList> {}

@Injectable({ providedIn: "root" })
@StoreConfig({ name: "wishesList", idKey: "name" })
export class WishesListStore extends EntityStore<WishesListState, WishList> {
  constructor() {
    super();
  }
}
