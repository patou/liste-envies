import { Injectable } from "@angular/core";
import {
  action,
  EntityDirtyCheckPlugin,
  ID,
  Order,
  transaction,
  withTransaction
} from "@datorama/akita";
import { WishState, WishStore } from "./wish.store";
import { WishListApiService } from "../../service/wish-list-api.service";
import { WishList } from "../../models/WishList";
import { WishComment, WishItem, WishItemState } from "../../models/WishItem";
import { Debounce, Throttle } from "lodash-decorators";
import { WishQuery } from "./wish.query";
import { empty, Observable, of } from "rxjs";
import { UserQuery } from "../app/user.query";
import {
  debounceTime,
  delay,
  filter,
  map,
  switchMap,
  take,
  tap
} from "rxjs/operators";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AkitaFiltersPlugin } from "akita-filters-plugin";
import { WishesListStore } from "./wishes-list.store";
import { UserAPIService } from "../../service/user-api.service";
import { LoginPopUpService } from "../../service/login-pop-up.service";
import { UserInfo } from "firebase";

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
    private wishesListStore: WishesListStore,
    private loginPopUp: LoginPopUpService
  ) {
    // @ts-ignore todo correct error with this parameters typescript error
    super(wishQuery, { filtersStoreName: "WishFilters" });
    // @ts-ignore todo correct error with this parameters typescript error
    this.draft = new EntityDirtyCheckPlugin<WishItem>(this.wishQuery);
  }

  get(name: string, loading: boolean = true) {
    if (!this.wishQuery.isToOfferListLoaded()) {
      this.wishStore.setLoading(loading);
      this.wishListApiService
        .wishes(name)
        .pipe(
          withTransaction(wishes => {
            this.wishStore.setLoading(false);
            this.wishStore.upsertMany(wishes);
            this.wishStore.setLoadedToOffer();
            this.draft.destroy();
          })
        )
        .subscribe();
    }
    this.displayActive();
  }

  refresh(type: string, listId: string) {
    this.wishStore.setReload();
    if (type === "toOffer") {
      this.get(listId, false);
    } else {
      this.getArchived(listId, false);
    }

    this.getWishListFullInfos(listId).subscribe();
  }

  displayActive() {
    this.setFilter({
      id: "status",
      hide: true,
      server: false,
      name: "actif",
      order: 1,
      predicate: wish => wish.state === WishItemState.ACTIVE
    });
  }

  getArchived(name: string, loading: boolean = true) {
    if (!this.wishQuery.isArchiveListLoaded()) {
      this.wishStore.setLoading(loading);
      this.wishListApiService
        .wishesArchived(name)
        .pipe(
          withTransaction(wishes => {
            this.wishStore.setLoading(false);
            this.wishStore.upsertMany(wishes);
            this.wishStore.setLoadedArchive();
            this.draft.destroy();
          })
        )
        .subscribe();
    }
    this.displayArchive();
  }

  displayArchive() {
    this.setFilter({
      id: "status",
      hide: true,
      server: false,
      name: "archived",
      order: 1,
      predicate: wish => wish.state === WishItemState.ARCHIVED
    });
  }

  @Throttle(400)
  getReceived(loading: boolean = true) {
    this.wishStore.setLoading(loading);
    this.userAPIService.archived("me").subscribe((wishes: WishItem[]) => {
      this.wishStore.setLoading(false);
      this.wishStore.set(wishes);
      this.draft.destroy();
    });
  }

  public getWishListFullInfos(name: string): Observable<WishList> {
    return this.wishListApiService.wishList(name).pipe(
      tap(fullList => {
        this.setWishList(fullList, true, true);
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
  give(id, wishToGive: Partial<WishItem>) {
    this.userQuery
      .select(store => store.user)
      .pipe(
        take(1),
        switchMap(
          this.connectIfNotConnected(
            "Vous devez vous connecter ou créer un compte afin d'indiquer que vous souhaitez offrir cette envie"
          )
        )
      )
      .subscribe(user => {
        if (user) {
          const wish: Partial<WishItem> = {
            listId: wishToGive.listId,
            id,
            userGiven: true,
            given: true,
            userTake: wishToGive.userTake ? [...wishToGive.userTake] : []
          };

          wish.userTake.push({
            name: user.displayName
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
      });
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
    this.userQuery
      .select(store => store.user)
      .pipe(
        take(1),
        switchMap(
          this.connectIfNotConnected(
            "Vous devez vous connecter ou créer un compte afin de pouvoir écrire un commentaire"
          )
        )
      )
      .subscribe(user => {
        if (user) {
          const newWish = { ...wish };
          const temporaryComment = {
            date: new Date().getUTCSeconds().toString(),
            from: {
              name: user.displayName,
              email: user.email,
              picture: user.photoURL
            },
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
      });
  }

  private connectIfNotConnected(message: string) {
    return (user: UserInfo): Observable<UserInfo> => {
      if (user === null) {
        return this.loginPopUp.openLoginPopUp(message);
      }
      return of(user);
    };
  }

  @action("set wishlist")
  @transaction()
  setWishList(wishList: WishList, initialSet: boolean, isFull: boolean) {
    this.wishesListStore.upsert(wishList.name, wishList);

    this.wishStore.update({
      wishList: { ...wishList }
    });
    if (initialSet) {
      this.wishStore.update({
        wishList: { ...wishList },
        ui: { loaded: { full: isFull, toOffer: false, archive: false } }
      });
    } else {
      this.wishStore.setLoadedToFull(isFull);
    }
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

  resetWishes() {
    this.wishStore.reset();
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
        this.draft.reset(id);
        this.wishStore.setError(error);
        this.snackBar.open("Erreur lors la mise à jour de l'envie");
      }
    );
  }
}
