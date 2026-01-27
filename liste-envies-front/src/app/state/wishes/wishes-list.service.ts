import { Injectable } from "@angular/core";
import { ID, SelectOptions } from "@datorama/akita";
import { WishesListState, WishesListStore } from "./wishes-list.store";
import { WishListApiService } from "../../service/wish-list-api.service";
import { throttle } from "lodash-decorators";
import { WishList } from "../../models/WishList";
import { WishService } from "./wish.service";
import { WishesListQuery } from "./wishes-list.query";
import { AkitaFiltersPlugin, searchFilterIn } from "akita-filters-plugin";
import {
  catchError,
  delayWhen,
  map,
  retryWhen,
  switchMap,
  tap
} from "rxjs/operators";
import { Observable, of, timer } from "rxjs";
import { Router, UrlTree } from "@angular/router";
import { HttpErrorResponse } from "@angular/common/http";
import { LoginPopUpService } from "../../service/login-pop-up.service";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({ providedIn: "root" })
export class WishesListService {
  private filters: AkitaFiltersPlugin<WishesListState>;

  constructor(
    private wishesListStore: WishesListStore,
    private wishListService: WishListApiService,
    private wishService: WishService,
    private wishesListQuery: WishesListQuery,
    private router: Router,
    private loginPopUp: LoginPopUpService,
    private snackBar: MatSnackBar
  ) {
    this.filters = new AkitaFiltersPlugin<WishesListState>(
      this.wishesListQuery
    );
  }

  @throttle(200)
  updateAllWishlist() {
    this.wishesListStore.setLoading(true);
    this.wishListService.listAll().subscribe(wishLists => {
      this.wishesListStore.upsertMany(wishLists);
      this.wishesListStore.setLoading(false);
      this.wishesListStore.setHasCache(true);
    });
  }

  getWishListsIfNotLoaded() {
    if (!this.wishesListQuery.getHasCache()) {
      this.updateAllWishlist();
    }
  }

  createOrReplace(wishesList: WishList): Observable<WishList> {
    return this.wishListService
      .createOrUpdateList(wishesList.name, wishesList)
      .pipe(
        tap(newList => {
          this.wishesListStore.upsert(newList.name, newList);
          this.wishService.setWishList(newList, false, false);
        })
      );
  }

  update(id, wishesList: Partial<WishList>) {
    this.wishesListStore.update(id, wishesList);
  }

  removeActive() {
    this.wishesListStore.setActive(null);
    return true;
  }

  setActiveOrLoad(listName: string): Observable<boolean | UrlTree> {
    if (!listName) {
      this.wishesListStore.setActive(null);
      this.resetFiltersAndWishes();
      return of(this.router.createUrlTree(["/"]));
    }
    if (this.wishesListQuery.getActiveId() === listName) {
      return of(true);
    }
    this.wishesListStore.setActive(listName);
    this.resetFiltersAndWishes();

    if (this.isAlreadyLoaded(listName)) {
      const listActive = this.wishesListQuery.getActive() as WishList;
      if (this.hasWishListAllInformationsLoaded(listActive)) {
        this.wishService.setWishList(listActive, true, true);
        return of(true);
      }
    }
    return this.wishService.getWishListFullInfos(listName).pipe(
      tap(this.throwHttpErrorIfNotAuthorized()),
      retryWhen(this.connectAndRetryIfNotConnected()),
      map(wishList => !!wishList),
      catchError(this.catchHttpErrorsAndRedirect(listName))
    );
  }

  private hasWishListAllInformationsLoaded(listActive: WishList) {
    return !(listActive.owner && !listActive.users?.length);
  }

  private resetFiltersAndWishes() {
    this.wishService.removeFilter("status");
    this.wishService.resetWishes();
  }

  private isAlreadyLoaded(listName: string) {
    return (
      this.wishesListQuery.getHasCache() &&
      this.wishesListQuery.hasEntity(listName)
    );
  }

  private catchHttpErrorsAndRedirect(listName: string) {
    return (error, caught) => {
      const errorCode: number =
        error instanceof HttpErrorResponse ? error.status : error;
      switch (errorCode) {
        case 404:
          this.snackBar.open(`La liste '${listName}' n'existe pas`, "ok", {
            duration: 5000,
            horizontalPosition: "center"
          });
          return of(
            this.router.createUrlTree(["/", "notExist"], {
              queryParams: { name: listName }
            })
          );
        case 401:
          this.snackBar.open(`Vous devez être connecté`, "ok", {
            duration: 5000,
            horizontalPosition: "center"
          });
          return of(this.router.createUrlTree(["/", "connect"]));
        case 403:
        default:
          this.snackBar.open(
            `La liste '${listName}' n'est pas accessible`,
            "ok",
            {
              duration: 5000,
              horizontalPosition: "center"
            }
          );
          return of(this.router.createUrlTree(["/"]));
      }
    };
  }

  private connectAndRetryIfNotConnected() {
    return errors => {
      if (errors)
        return errors.pipe(
          // throw error, if it was not 403 errors.
          tap(this.throwIfNot401HttpError()),
          //display pop-up connection
          switchMap(val => {
            return this.loginPopUp.openLoginPopUp(
              "Vous devez être connecté pour avoir accès à cette page"
            );
          }),
          tap(this.throw401ErrorIfCancelLogin())
        );
    };
  }

  private throw401ErrorIfCancelLogin() {
    return val => {
      if (!val) {
        throw 401;
      }
    };
  }

  private throwIfNot401HttpError() {
    return val => {
      if (val !== 401) {
        throw val;
      }
    };
  }

  private throwHttpErrorIfNotAuthorized() {
    return (wishList: WishList) => {
      if (wishList.privacy === "PRIVATE" && wishList.state === "ANONYMOUS") {
        throw 401;
      } else if (
        wishList.privacy === "OPEN" &&
        wishList.state === "ANONYMOUS"
      ) {
        throw 401;
      } else if (
        wishList.privacy === "PRIVATE" &&
        wishList.state === "LOGGED"
      ) {
        throw 403;
      }
    };
  }

  remove(id: ID) {
    this.wishesListStore.remove(id);
  }

  selectAllByFilters(options: SelectOptions<WishList>) {
    return this.filters.selectAllByFilters(options);
  }

  searchList(search: string) {
    if (search === "") {
      this.filters.removeFilter("search");
    } else {
      this.filters.setFilter({
        id: "search",
        value: search,
        predicate: (list: WishList) => searchFilterIn(search, list, "title")
      });
    }
  }

  archiveWishList(name: string) {
    return this.wishListService.archiveWishList(name).pipe(
      tap(value => {
        this.wishesListStore.remove(name);
      })
    );
  }
}
