import { Injectable } from "@angular/core";
import { ID, SelectOptions } from "@datorama/akita";
import { WishesListState, WishesListStore } from "./wishes-list.store";
import { WishListApiService } from "../../service/wish-list-api.service";
import { throttle } from "lodash-decorators";
import { WishList } from "../../models/WishList";
import { WishService } from "./wish.service";
import { WishesListQuery } from "./wishes-list.query";
import { AkitaFiltersPlugin, searchFilterIn } from "akita-filters-plugin";
import { tap } from "rxjs/operators";
import { Observable } from "rxjs";

@Injectable({ providedIn: "root" })
export class WishesListService {
  private filters: AkitaFiltersPlugin<WishesListState>;
  constructor(
    private wishesListStore: WishesListStore,
    private wishListService: WishListApiService,
    private wishService: WishService,
    private wishesListQuery: WishesListQuery
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

  setActive(listName: string): boolean | Observable<WishList> {
    if (!listName) {
      this.wishesListStore.setActive(null);
      return false;
    }
    if (this.wishesListQuery.getActiveId() === listName) {
      return true;
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
        console.log("Set active list infos after ", listActive);
        this.wishService.setWishList(listActive, true, true);
        return true;
      }
      console.log("Do not set active list infos ", listActive);
    }
    return this.wishService.getWishListFullInfos(listName).pipe(
      tap(fullList => {
        console.log("Set Full List infos after ", fullList);
        this.wishService.setWishList(fullList, true, true);
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
