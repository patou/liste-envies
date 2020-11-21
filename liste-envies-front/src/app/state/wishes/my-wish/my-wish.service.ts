import { Injectable } from "@angular/core";
import { ID } from "@datorama/akita";
import { MyWishStore } from "./my-wish.store";
import { WishItem } from "../../../models/WishItem";
import { UserAPIService } from "../../../service/user-api.service";
import { Debounce, Delay } from "lodash-decorators";

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

  async loadAll() {
    await this.loadGiven();
    await this.loadArchive();
  }

  private loadGiven(): Promise<void> {
    return new Promise(resolve => {
      this.userApi.given("me").subscribe(
        (values: WishItem[]) => {
          this.add(values);
          this.myWishStore.update({ ui: { isBasketLoaded: true } });
          resolve();
        },
        () => resolve()
      );
    });
  }

  private loadArchive() {
    return new Promise(resolve => {
      this.userApi.archived("me").subscribe(
        (values: WishItem[]) => {
          this.add(values);
          this.myWishStore.update({ ui: { isArchiveLoaded: true } });
          resolve();
        },
        () => resolve()
      );
    });
  }
}
