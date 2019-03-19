import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Resolve,
  Router,
  RouterStateSnapshot
} from "@angular/router";

import { WishListApiService } from "./wish-list-api.service";
import { Observable } from "rxjs/Observable";
import { WishList } from "../models/WishList";
import { WishService } from "../state/wishes/wish.service";
import { WishQuery } from "../state/wishes/wish.query";
import { WishState } from "../state/wishes/wish.store";
import { WishesListQuery } from "../state/wishes/wishes-list.query";
import { WishesListService } from "../state/wishes/wishes-list.service";
import { pluck } from "rxjs/operators";
import { debounce } from "lodash-decorators";

@Injectable()
export class WishListResolver implements Resolve<boolean | WishList> {
  constructor(
    private router: Router,
    private wishService: WishService,
    private wishQuery: WishQuery,
    private wishListService: WishesListService
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<WishList> {
    return this.setActive(route);
  }

  private setActive(
    route: ActivatedRouteSnapshot
  ): boolean | Observable<WishList> {
    return this.wishListService.setActive(route.params.listId);
  }
}
