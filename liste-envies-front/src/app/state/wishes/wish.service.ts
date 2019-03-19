import { Injectable } from "@angular/core";
import { action, EntityDirtyCheckPlugin, ID, Order } from "@datorama/akita";
import { HttpClient } from "@angular/common/http";
import { WishState, WishStore } from "./wish.store";
import { WishListApiService } from "../../service/wish-list-api.service";
import { WishList } from "../../models/WishList";
import { Owner, WishComment, WishItem } from "../../models/WishItem";
import { Debounce, Throttle } from "lodash-decorators";
import { WishQuery } from "./wish.query";
import { Observable } from "rxjs/Observable";
import { PartialObserver } from "rxjs/Observer";
import { UserQuery } from "../app/user.query";
import { delay, map, tap } from "rxjs/operators";
import { MatSnackBar } from "@angular/material";
import { Filter, FiltersPlugin } from "@datorama/akita-filters-plugin";

@Injectable({ providedIn: "root" })
export class WishService extends FiltersPlugin {
  private draft: EntityDirtyCheckPlugin<WishItem>;
  private filters: FiltersPlugin<WishState, WishItem, any>;

  constructor(
    private wishStore: WishStore,
    private wishQuery: WishQuery,
    private wishListApiService: WishListApiService,
    private userQuery: UserQuery,
    private snackBar: MatSnackBar
  ) {
    super(wishQuery, { filtersStoreName: "WishFilters" });
    this.draft = new EntityDirtyCheckPlugin<WishItem>(this.wishQuery);
  }

  @Throttle(400)
  get(name: string, loading: boolean = true) {
    this.wishStore.setLoading(loading);

    this.wishListApiService.wishes(name).subscribe((wishes: WishItem[]) => {
      this.wishStore.setLoading(false);
      this.wishStore.set(wishes);
      this.draft.destroy();
    });

    this.getWishListInfosDelayed(name);
  }

  @Debounce(100)
  private getWishListInfosDelayed(name: string) {
    this.getWishListFullInfos(name).subscribe(() => {});
  }

  public getWishListFullInfos(name: string): Observable<WishList> {
    return this.wishListApiService.wishList(name).pipe(
      tap((wishList: WishList) => {
        this.wishStore.update({ wishList });
      })
    );
  }

  add(listId: string, wish: WishItem) {
    this.wishListApiService
      .createWish(listId, wish)
      .subscribe((newWish: WishItem) => {
        this.wishStore.add(newWish);
      });
  }

  update(id, wish: Partial<WishItem>) {
    if (this.isChanged(id, wish)) {
      this.subscribeAndUpdatedWish(
        id,
        this.wishListApiService.updateWish(wish.listId, id, wish)
      );
    }
  }

  @action("give wish")
  give(id, wish: Partial<WishItem>) {
    wish = {};
    wish.userGiven = true;
    wish.given = true;
    wish.userTake = wish.userTake ? [...wish.userTake] : [];
    wish.userTake.push({
      name: this.userQuery.getValue().user.displayName
    });
    if (this.isChanged(id, wish)) {
      this.subscribeAndUpdatedWish(
        id,
        this.wishListApiService.give(wish.listId, id).pipe(
          map<WishItem, WishItem>(newWish => {
            // todo correct return in serveur
            wish.userTake = newWish.userTake;
            return wish;
          })
        )
      );
    }
  }

  remove(id: ID) {
    this.wishStore.remove(id);
  }

  @action("add comment")
  comment(listId: string, id: number, comment: WishComment, wish: WishItem) {
    const newWish = { ...wish };
    const temporaryComment = {
      date: new Date().getUTCSeconds().toString(),
      from: { name: this.userQuery.getValue().user.displayName },
      ...comment
    };
    newWish.comments = wish.comments ? [...wish.comments] : [];
    newWish.comments.push(temporaryComment);
    if (this.isChanged(id, newWish)) {
      this.subscribeAndUpdatedWish(
        id,
        this.wishListApiService.comment(listId, id, comment)
      );
    }
  }

  @action("set wishlist")
  setWishList(wishList: WishList) {
    // todo verify if their are a more complete data before update it.

    this.wishStore.update({ wishList });
  }

  selectIsActive(id: ID): Observable<boolean> {
    return this.wishQuery.selectIsActive(id);
  }

  private isChanged(id, wish: Partial<WishItem>) {
    this.draft.setHead(id);
    wish.draft = true;
    this.wishStore.update(id, wish);
    return true;
  }

  private subscribeAndUpdatedWish(id, observer: Observable<WishItem>) {
    return observer.subscribe(
      (wishUpdated: WishItem) => {
        wishUpdated.draft = false;
        this.wishStore.update(id, wishUpdated);
        this.draft.setHead(id);
      },
      error => {
        console.error("error update wish", id, error);
        this.draft.reset(id);
        this.wishStore.setError(error);
        this.snackBar.open("Erreur lors la mise à jour de l'envie");
      }
    );
  }

  setOrderBy(by: any, order: string | "+" | "-") {
    this.setSortBy({
      sortBy: by,
      sortByOrder: order === "+" ? Order.ASC : Order.DESC
    });
  }

  getSort(): string | null {
    const sortValue = this.getSortValue();
    if (!sortValue) return "+date";
    const order: string = sortValue.sortByOrder === Order.ASC ? "+" : "-";
    return sortValue.sortBy ? order + sortValue.sortBy.toString() : "+date";
  }
}
