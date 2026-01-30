import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot
} from "@angular/router";

import { WishService } from "../state/wishes/wish.service";

@Injectable()
export class WishListItemsArchivedResolver {
  constructor(private router: Router, private wishService: WishService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    this.wishService.getArchived(route.params.listId);
    return true;
  }
}
