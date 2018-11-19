import { Injectable } from "@angular/core";
import { action, ID } from "@datorama/akita";
import { HttpClient } from "@angular/common/http";
import { WishStore } from "./wish.store";
import { WishListApiService } from "../../service/wish-list-api.service";
import { WishList } from "../../models/WishList";
import { WishComment, WishItem } from "../../models/WishItem";
import { Debounce, Throttle } from "lodash-decorators";

@Injectable({ providedIn: "root" })
export class WishService {
  constructor(
    private wishStore: WishStore,
    private wishListApiService: WishListApiService
  ) {}

  @Throttle(400)
  get(name: string, loading: boolean = true) {
    this.wishStore.setLoading(loading);

    this.wishListApiService.wishes(name).subscribe((wishes: WishItem[]) => {
      console.log("wishListItems :", wishes);
      this.wishStore.setLoading(false);
      this.wishStore.set(wishes);
    });

    this.getWishListInfos(name);
  }

  @Debounce(100)
  private getWishListInfos(name: string) {
    this.wishListApiService.wishList(name).subscribe((wishList: WishList) => {
      console.log("wishList :", wishList);
      this.wishStore.updateRoot({ wishList });
    });
  }

  add(listId: string, wish: WishItem) {
    this.wishListApiService
      .createWish(listId, wish)
      .subscribe((Wish: WishItem) => {
        this.wishStore.add(wish);
      });
  }

  update(id, wish: Partial<WishItem>) {
    this.wishListApiService
      .updateWish(wish.listId, id, wish)
      .subscribe((Wish: WishItem) => {
        this.wishStore.update(id, wish);
      });
  }

  @action({ type: "give wish" })
  give(id, wish: Partial<WishItem>) {
    this.wishListApiService
      .give(wish.listId, id)
      .subscribe((newWish: WishItem) => {
        this.wishStore.update(id, newWish);
      });
  }

  remove(id: ID) {
    this.wishStore.remove(id);
  }

  @action({ type: "set wishlist" })
  setWishList(wishList: Partial<WishList>) {
    // todo verify if their are a more complete data before update it.
    this.wishStore.updateRoot({ wishList });
  }

  @action({ type: "add comment" })
  comment(listId: string, id: number, note: Partial<WishComment>) {
    this.wishListApiService
      .comment(listId, id, note)
      .subscribe((newWish: WishItem) => {
        this.wishStore.update(id, newWish);
      });
  }
}
