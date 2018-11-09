import { Injectable } from "@angular/core";
import { EntityState, EntityStore, StoreConfig } from "@datorama/akita";
import { Wish } from "./wish.model";

export interface WishState extends EntityState<Wish> {}

@Injectable({ providedIn: "root" })
@StoreConfig({ name: "wish" })
export class WishStore extends EntityStore<WishState, Wish> {
  constructor() {
    super();
  }
}
