import { Injectable } from "@angular/core";
import { ID } from "@datorama/akita";
import { HttpClient } from "@angular/common/http";
import { WishStore } from "./wish.store";
import { WishListApiService } from "../../service/wish-list-api.service";
import { WishList } from "../../models/WishList";
import { WishItem } from "../../models/WishItem";

@Injectable({ providedIn: "root" })
export class WishService {
  constructor(
    private wishStore: WishStore,
    private wishListApiService: WishListApiService
  ) {}

  get(name: string) {
    this.wishStore.setLoading(true);
    this.wishListApiService.wishList(name).subscribe((wishList: WishList) => {
      console.log("wishList :", wishList);
      this.wishStore.updateRoot({ wishList });
    });
    this.wishListApiService.wishes(name).subscribe((wishes: WishItem[]) => {
      console.log("wishListItems :", wishes);
      this.wishStore.setLoading(false);
      this.wishStore.set(wishes);
    });
  }

  add(wish: WishItem) {
    this.wishStore.add(wish);
  }

  update(id, wish: Partial<WishItem>) {
    this.wishStore.update(id, wish);
  }

  remove(id: ID) {
    this.wishStore.remove(id);
  }

  setWishList(wishList: Partial<WishList>) {
    // todo verify if their are a more complete data before update it.
    this.wishStore.updateRoot({ wishList });
  }
}
