import { Injectable } from "@angular/core";
import {ActiveState, EntityState, EntityStore, StoreConfig} from '@datorama/akita';
import { WishList } from "../../models/WishList";
import { WishItem } from "../../models/WishItem";

export interface WishState extends EntityState<WishItem>, ActiveState {
  wishList: WishList;
  ui: {};
}

@Injectable({ providedIn: "root" })
@StoreConfig({ name: "wish" })
export class WishStore extends EntityStore<WishState> {
  constructor() {
    super();
  }
}
