import { Injectable } from "@angular/core";
import { ID } from "@datorama/akita";
import { HttpClient } from "@angular/common/http";
import { WishStore } from "./wish.store";
import { Wish } from "./wish.model";

@Injectable({ providedIn: "root" })
export class WishService {
  constructor(private wishStore: WishStore, private http: HttpClient) {}

  get() {
    this.http
      .get("https://akita.com")
      .subscribe(entities => this.wishStore.set(entities));
  }

  add(wish: Wish) {
    this.wishStore.add(wish);
  }

  update(id, wish: Partial<Wish>) {
    this.wishStore.update(id, wish);
  }

  remove(id: ID) {
    this.wishStore.remove(id);
  }

}
