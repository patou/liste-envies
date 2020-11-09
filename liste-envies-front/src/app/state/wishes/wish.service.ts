import { Injectable } from "@angular/core";
import { action, EntityDirtyCheckPlugin, ID, Order } from "@datorama/akita";
import { WishState, WishStore } from "./wish.store";
import { WishListApiService } from "../../service/wish-list-api.service";
import { WishList } from "../../models/WishList";
import { WishComment, WishItem } from "../../models/WishItem";
import { Debounce, Throttle } from "lodash-decorators";
import { WishQuery } from "./wish.query";
import { Observable } from "rxjs";
import { UserQuery } from "../app/user.query";
import { map } from "rxjs/operators";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AkitaFiltersPlugin } from "akita-filters-plugin";
import { WishesListStore } from "./wishes-list.store";
import { UserAPIService } from "../../service/user-api.service";

@Injectable({ providedIn: "root" })
export class WishService extends AkitaFiltersPlugin<WishState> {
  private draft: EntityDirtyCheckPlugin<WishItem>;

  constructor(
    private wishStore: WishStore,
    private wishQuery: WishQuery,
    private wishListApiService: WishListApiService,
    private userAPIService: UserAPIService,
    private userQuery: UserQuery,
    private snackBar: MatSnackBar,
    private wishesListStore: WishesListStore
  ) {
    // @ts-ignore todo correct error with this parameters typescript error
    super(wishQuery, { filtersStoreName: "WishFilters" });
    // @ts-ignore todo correct error with this parameters typescript error
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

  @Throttle(400)
  getArchived(name: string, loading: boolean = true) {
    this.wishStore.setLoading(loading);

    this.wishListApiService
      .wishesArchived(name)
      .subscribe((wishes: WishItem[]) => {
        this.wishStore.setLoading(false);
        this.wishStore.set(wishes);
        this.draft.destroy();
      });

    this.getWishListInfosDelayed(name);
  }

  @Throttle(400)
  getReceived(loading: boolean = true) {
    this.wishStore.setLoading(loading);
    this.userAPIService.archived("me").subscribe((wishes: WishItem[]) => {
      this.wishStore.setLoading(false);
      this.wishStore.set(wishes);
      this.draft.destroy();
    });

    this.getWishListInfosDelayed(name);
  }

  public getWishListFullInfos(name: string): Observable<WishList> {
    return this.wishListApiService.wishList(name);
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
  give(id, wishToGive: Partial<WishItem>) {
    const wish: Partial<WishItem> = {
      listId: wishToGive.listId,
      id,
      userGiven: true,
      given: true,
      userTake: wishToGive.userTake ? [...wishToGive.userTake] : []
    };
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

  @action("delete wish")
  remove(id, wish: Partial<WishItem>) {
    this.wishListApiService.delete(wish.listId, id).subscribe(() => {
      this.wishStore.remove(id);
    });
  }

  @action("archive wish")
  archive(id, wish: Partial<WishItem>) {
    this.wishListApiService.archive(wish.listId, id).subscribe(() => {
      this.wishStore.remove(id);
    });
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

    this.wishesListStore.upsert(wishList.name, wishList);
    this.wishStore.update({ wishList: { ...wishList } });
  }

  selectIsActive(id: ID): Observable<boolean> {
    return this.wishQuery.selectIsActive(id);
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

  setLoading(loading: boolean = true) {
    this.wishStore.setLoading(loading);
  }

  @Debounce(100)
  private getWishListInfosDelayed(name: string) {
    /*this.getWishListFullInfos(name).subscribe((wishList: WishList) => {
      this.setWishList(wishList);
    });*/
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
}
