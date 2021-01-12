import { Injectable } from "@angular/core";
import { ID, SelectOptions } from "@datorama/akita";
import { WishesListState, WishesListStore } from "./wishes-list.store";
import { WishListApiService } from "../../service/wish-list-api.service";
import { throttle } from "lodash-decorators";
import { WishList } from "../../models/WishList";
import { WishService } from "./wish.service";
import { WishesListQuery } from "./wishes-list.query";
import { AkitaFiltersPlugin, searchFilterIn } from "akita-filters-plugin";
import { catchError, map, tap } from "rxjs/operators";
import { Observable, of } from "rxjs";
import { Router, UrlTree } from "@angular/router";
import { HttpErrorResponse } from "@angular/common/http";

@Injectable({ providedIn: "root" })
export class WishesListService {
  private filters: AkitaFiltersPlugin<WishesListState>;
  constructor(
    private wishesListStore: WishesListStore,
    private wishListService: WishListApiService,
    private wishService: WishService,
    private wishesListQuery: WishesListQuery,
    private router: Router
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
      return of(this.router.createUrlTree(["/"]));
    }
    if (this.wishesListQuery.getActiveId() === listName) {
      return of(true);
    }
    this.wishesListStore.setActive(listName);
    this.wishService.removeFilter("status");
    this.wishService.resetWishes();
    if (
      this.wishesListQuery.getHasCache() &&
      this.wishesListQuery.hasEntity(listName)
    ) {
      const listActive = this.wishesListQuery.getActive() as WishList;
      if (!(listActive.owner && !listActive.users?.length)) {
        this.wishService.setWishList(listActive, true, true);
        return of(true);
      }
    }
    return this.wishService.getWishListFullInfos(listName).pipe(
      map(wishList => !!wishList),
      catchError((error, caught) => {
        console.error("Error catch ", error);
        if (error instanceof HttpErrorResponse) {
          switch (error.status) {
            case 404:
              return of(
                this.router.createUrlTree(["/", "notExist"], {
                  queryParams: { name: listName },
                  state: { name: listName }
                })
              );
            case 403:
              return of(this.router.createUrlTree(["/", "connect"]));
            default:
              return of(this.router.createUrlTree(["/"]));
          }
        }
      })
    );
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
