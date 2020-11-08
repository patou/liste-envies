import { Injectable } from "@angular/core";
import { EntityState, EntityStore, StoreConfig } from "@datorama/akita";
import { WishItem } from "../../../models/WishItem";
import { WishList } from "../../../models/WishList";

export interface DemoState extends EntityState<WishItem> {
  wishList: WishList;
  ui: {
    user: "OWNER" | "REGISTRER" | "PUBLIC";
  };
}

@Injectable({ providedIn: "root" })
@StoreConfig({ name: "demo" })
export class DemoStore extends EntityStore<DemoState, WishItem> {
  constructor() {
    super();
  }
}
