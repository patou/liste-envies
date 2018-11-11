import { Injectable } from "@angular/core";
import { ID } from "@datorama/akita";
import { WishesListStore } from "./wishes-list.store";
import { createWishesList } from "./wishes-list.model";
import { WishListApiService } from "../../service/wish-list-api.service";
import { throttle, Debounce } from "lodash-decorators";
import { WishList } from "../../models/WishList";
import { WishService } from "./wish.service";
import { WishesListQuery } from "./wishes-list.query";

@Injectable({ providedIn: "root" })
export class WishesListService {
  constructor(
    private wishesListStore: WishesListStore,
    private wishListService: WishListApiService,
    private wishService: WishService,
    private wishesListQuery: WishesListQuery
  ) {}

  @Debounce(500)
  get() {
    // console.trace('WishesListService.get()');
    this.wishesListStore.setLoading(true);
    this.wishListService.listAll().subscribe(entities => {
      this.wishesListStore.set(entities);
      this.wishesListStore.setLoading(false);
    });
  }

  add(wishesList: WishList) {
    this.wishesListStore.add(wishesList);
  }

  update(id, wishesList: Partial<WishList>) {
    this.wishesListStore.update(id, wishesList);
  }

  setActive(listName: string) {
    this.wishesListStore.setActive(listName);
    this.wishService.setWishList(this.wishesListQuery.getActive());
  }

  remove(id: ID) {
    this.wishesListStore.remove(id);
  }
}
