import { Injectable } from "@angular/core";
import { ID, SelectOptions } from "@datorama/akita";
import { WishesListStore } from "./wishes-list.store";
import { WishListApiService } from "../../service/wish-list-api.service";
import { Debounce } from "lodash-decorators";
import { WishList } from "../../models/WishList";
import { WishService } from "./wish.service";
import { WishesListQuery } from "./wishes-list.query";
import { FiltersPlugin, searchFilterIn } from "@datorama/akita-filters-plugin";
import { tap } from "rxjs/operators";
import { Observable } from "rxjs/Observable";

@Injectable({ providedIn: "root" })
export class WishesListService {
  private filters: FiltersPlugin<any, any, any>;
  constructor(
    private wishesListStore: WishesListStore,
    private wishListService: WishListApiService,
    private wishService: WishService,
    private wishesListQuery: WishesListQuery
  ) {
    this.filters = new FiltersPlugin(this.wishesListQuery);
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
          console.log("createOrReplace list", newList);
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
      this.wishService.setWishList(
        this.wishesListQuery.getActive() as WishList
      );
      return true;
    } else {
      return this.wishService.getWishListFullInfos(listName);
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
