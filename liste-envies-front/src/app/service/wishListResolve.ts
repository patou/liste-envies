import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanDeactivate,
  Router,
  RouterStateSnapshot,
  UrlTree
} from "@angular/router";
import { Observable } from "rxjs";
import { WishService } from "../state/wishes/wish.service";
import { WishQuery } from "../state/wishes/wish.query";
import { WishesListService } from "../state/wishes/wishes-list.service";
import { ListComponent } from "../page/list/list.component";

@Injectable()
export class WishListGuard
  implements CanActivate, CanDeactivate<ListComponent> {
  constructor(
    private router: Router,
    private wishService: WishService,
    private wishQuery: WishQuery,
    private wishListService: WishesListService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.canLoadWishList(route);
  }

  canDeactivate(
    component: ListComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.wishListService.removeActive();
  }

  private canLoadWishList(
    route: ActivatedRouteSnapshot
  ): Observable<boolean | UrlTree> {
    return this.wishListService.setActiveOrLoad(route.params.listId);
  }
}
