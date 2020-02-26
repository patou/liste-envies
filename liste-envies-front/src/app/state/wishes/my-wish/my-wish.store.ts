import { Injectable } from "@angular/core";
import { EntityState, EntityStore, StoreConfig } from "@datorama/akita";
import { WishItem } from "../../../models/WishItem";

export interface MyWishState extends EntityState<WishItem> {
  ui: {
    isBasketLoaded?: boolean;
    isArchiveLoaded?: boolean;
    isTrashLoaded?: boolean;
  };
}

@Injectable({ providedIn: "root" })
@StoreConfig({ name: "demo" })
export class MyWishStore extends EntityStore<MyWishState, WishItem> {
  constructor() {
    super({
      ui: {
        isBasketLoaded: false,
        isArchiveLoaded: false,
        isTrashLoaded: false
      }
    });
  }
}
