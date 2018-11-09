import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Resolve,
  Router,
  RouterStateSnapshot
} from "@angular/router";

import { WishListApiService } from "./wish-list-api.service";
import { Observable } from "rxjs/Observable";
import { WishItem } from "../models/WishItem";

@Injectable()
export class WishListItemsResolver implements Resolve<WishItem[]> {
  constructor(
    private router: Router,
    private wishListService: WishListApiService
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<WishItem[]> {
    console.log("List items resolve ", route);
    return this.wishListService.wishes(route.params.listId);
  }
}
