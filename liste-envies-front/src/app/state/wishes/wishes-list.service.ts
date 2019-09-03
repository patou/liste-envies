import { Injectable } from "@angular/core";
import { ID, SelectOptions } from "@datorama/akita";
import {WishesListState, WishesListStore} from './wishes-list.store';
import { WishListApiService } from "../../service/wish-list-api.service";
import { Debounce } from "lodash-decorators";
import { WishList } from "../../models/WishList";
import { WishService } from "./wish.service";
import { WishesListQuery } from "./wishes-list.query";
import { AkitaFiltersPlugin, searchFilterIn } from "akita-filters-plugin";
import { tap } from "rxjs/operators";
import { Observable } from "rxjs/Observable";

@Injectable({ providedIn: "root" })
export class WishesListService {
  private filters: AkitaFiltersPlugin<WishesListState>;
  constructor(
    private wishesListStore: WishesListStore,
    private wishListService: WishListApiService,
    private wishService: WishService,
    private wishesListQuery: WishesListQuery
  ) {
    // @ts-ignore
    this.filters = new AkitaFiltersPlugin<WishesListState>(this.wishesListQuery);
  }

  @Debounce(200)
  get() {
    this.wishesListStore.setLoading(true);
    this.wishListService.listAll().subscribe(entities => {
      this.wishesListStore.set(entities);
      this.wishesListStore.setLoading(false);
    });
  }

  createOrReplace(wishesList: WishList): Observable<WishList> {
    return this.wishListService
      .createOrUpdateList(wishesList.name, wishesList)
      .pipe(
        tap(newList => {
          this.wishesListStore.upsert(newList.name, newList);
          this.wishService.setWishList(newList);
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
    this.wishesListStore.setActive(listName);
    if (
      this.wishesListQuery.getHasCache() &&
      this.wishesListQuery.hasEntity(listName)
    ) {
      const listActive = this.wishesListQuery.getActive() as WishList;

      if (listActive.owner && !listActive.users) {
        return this.wishService
          .getWishListFullInfos(listName)
          .pipe(tap(fullList => this.wishService.setWishList(fullList)));
      } else {
        this.wishService.setWishList(listActive);
        return true;
      }
    } else {
      return this.wishService.getWishListFullInfos(listName).pipe(
        tap(fullList => {
          this.wishService.setWishList(fullList);
        })
      );
    }
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
}
