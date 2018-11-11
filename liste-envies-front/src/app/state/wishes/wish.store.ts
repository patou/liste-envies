import { Injectable } from "@angular/core";
import { EntityState, EntityStore, StoreConfig } from "@datorama/akita";
import { WishList } from "../../models/WishList";
import { WishItem } from "../../models/WishItem";

export interface WishState extends EntityState<WishItem> {
  wishList: WishList;
  ui: {};
}

@Injectable({ providedIn: "root" })
@StoreConfig({ name: "wish" })
export class WishStore extends EntityStore<WishState, WishItem> {
  constructor() {
    super();
  }
}
