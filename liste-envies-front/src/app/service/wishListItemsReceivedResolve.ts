import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Resolve,
  Router,
  RouterStateSnapshot
} from "@angular/router";

import { WishService } from "../state/wishes/wish.service";

@Injectable()
export class WishListItemsReceivedResolver implements Resolve<boolean> {
  constructor(private router: Router, private wishService: WishService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    this.wishService.getReceived();
    return true;
  }
}
