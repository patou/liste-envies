import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Resolve,
  Router,
  RouterStateSnapshot
} from "@angular/router";

import { Observable } from "rxjs/Observable";
import { WishItem } from "../models/WishItem";
import { WishService } from "../state/wishes/wish.service";
import { WishQuery } from "../state/wishes/wish.query";

@Injectable()
export class WishListItemsResolver implements Resolve<boolean> {
  constructor(
    private router: Router,
    private wishService: WishService,
    private wishQuery: WishQuery
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    console.log("List items resolve ", route);
    this.wishService.get(route.params.listId);
    return true;
  }
}
