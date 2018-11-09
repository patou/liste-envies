import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';

import {WishListApiService} from './wish-list-api.service';
import {Observable} from 'rxjs/Observable';
import {WishList} from '../models/WishList';

@Injectable()
export class WishListResolver implements Resolve<WishList> {


  constructor(private router: Router, private wishListService: WishListApiService) {
  }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<WishList> {
    console.log('List resolve ', route);
    return this.wishListService.wishList(route.params.listId);
  }
}
