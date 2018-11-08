import { Injectable } from "@angular/core";
import { EntityState, EntityStore, StoreConfig } from "@datorama/akita";
import { WishesList } from "./wishes-list.model";

export interface WishesListState extends EntityState<WishesList> {}

@Injectable({ providedIn: "root" })
@StoreConfig({ name: "wishesList", idKey: "name" })
export class WishesListStore extends EntityStore<WishesListState, WishesList> {
  constructor() {
    super();
  }
}
