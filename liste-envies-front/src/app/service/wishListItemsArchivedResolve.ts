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
export class WishListItemsArchivedResolver implements Resolve<boolean> {
  constructor(
    private router: Router,
    private wishService: WishService,
    private wishQuery: WishQuery
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    this.wishService.getArchived(route.params.listId);
    return true;
  }
}
