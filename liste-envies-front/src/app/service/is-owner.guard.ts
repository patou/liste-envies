import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree
} from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";
import { map, take } from "rxjs/operators";
import { User } from "firebase";
import { WishesListQuery } from "../state/wishes/wishes-list.query";
import { filterNil } from "@datorama/akita";
import { WishList } from "../models/WishList";

@Injectable({
  providedIn: "root"
})
export class IsOwnerGuard implements CanActivate {
  constructor(private wishListQuery: WishesListQuery, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | UrlTree {
    if (!next.params.listId) {
      return this.router.parseUrl("/");
    }
    return this.wishListQuery.selectEntity(next.params.listId).pipe(
      filterNil,
      take(1),
      map<WishList, boolean | UrlTree>(wishList =>
        wishList.owner ? true : this.router.parseUrl(`/${next.params.listId}`)
      )
    );
  }
}
