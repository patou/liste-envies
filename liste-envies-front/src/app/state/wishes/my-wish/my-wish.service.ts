import { Injectable } from "@angular/core";
import { ID } from "@datorama/akita";
import { MyWishStore } from "./my-wish.store";
import { WishItem } from "../../../models/WishItem";
import { UserAPIService } from "../../../service/user-api.service";

@Injectable({ providedIn: "root" })
export class MyWishService {
  constructor(
    private myWishStore: MyWishStore,
    private userApi: UserAPIService
  ) {}

  add(wishes: WishItem[]) {
    this.myWishStore.upsertMany(wishes);
  }

  update(wishes: WishItem[]) {
    this.myWishStore.set(wishes);
  }

  remove(id: ID) {
    this.myWishStore.remove(id);
  }

  loadAll() {
    this.userApi.archived("me").subscribe((values: WishItem[]) => {
      console.log("archived loaded", values);
      this.add(values);
      this.myWishStore.update({ ui: { isArchiveLoaded: true } });
    });

    this.userApi.given("me").subscribe((values: WishItem[]) => {
      console.log("given loaded", values);
      this.add(values);
      this.myWishStore.update({ ui: { isBasketLoaded: true } });
    });
  }
}
