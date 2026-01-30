import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree
} from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";
import { map } from "rxjs/operators";
import type { User } from "firebase/auth";

@Injectable({
  providedIn: "root"
})
export class IsConnectedGuard {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    return this.authService.isConnected().pipe(
      map<boolean, boolean | UrlTree>(user =>
        user ? true : this.router.parseUrl("/connect")
      )
    );
  }
}
