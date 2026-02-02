import { Injectable } from "@angular/core";
import { lastValueFrom, AsyncSubject, Observable } from "rxjs";
import type { User as FirebaseUser, UserInfo } from "firebase/auth";
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from "@angular/common/http";
import { MatDialog } from "@angular/material/dialog";
import { Auth, user, signOut } from "@angular/fire/auth";
import { distinct, map, tap } from "rxjs/operators";
import { WishesListService } from "../state/wishes/wishes-list.service";
import { UserService } from "../state/app/user.service";
import { UserQuery } from "../state/app/user.query";
import { UserState } from "../state/app/user.store";

@Injectable()
export class AuthService implements HttpInterceptor {
  public static currentUser: FirebaseUser;
  public static currentToken: string;

  public user: Observable<FirebaseUser | null>;
  private firebaseAuthInit$: AsyncSubject<boolean> = new AsyncSubject<
    boolean
  >();
  private _init: boolean = false;

  constructor(
    private auth: Auth,
    public dialog: MatDialog,
    private wishesList: WishesListService,
    private userService: UserService,
    private userQuery: UserQuery
  ) {
    this.user = this.userQuery
      .select()
      .pipe(map((state: UserState) => state.user as FirebaseUser | null));

    this.subscribeToAuthState();
  }

  init(): Promise<boolean> {
    return this._init ? Promise.resolve(true) : this.subscribeToAuthState();
  }

  private subscribeToAuthState(): Promise<boolean> {
    user(this.auth)
      .pipe(
        distinct((user: FirebaseUser | null) => user?.uid),
        tap(this.emitInitEventForFirstTime())
      )
      .subscribe(
        (user: FirebaseUser | null) => {
          if (user) {
            if (this.isADifferentUserOrIsNotInitialised(user)) {
              this.initUser(user);
            }

            AuthService.currentUser = user;
          } else {
            this.resetCurrentUser();
          }
        },
        error => {
          console.error("error with login :", error);
          this.resetCurrentUser();
        }
      );
    return lastValueFrom(this.firebaseAuthInit$);
  }

  private emitInitEventForFirstTime() {
    return () => {
      if (!this._init) {
        console.log("Alread init");
        this.firebaseAuthInit$.next(true);
        this.firebaseAuthInit$.complete();
        this._init = true;
      }
    };
  }

  private isADifferentUserOrIsNotInitialised(user: FirebaseUser) {
    return (
      (AuthService.currentUser && user.uid !== AuthService.currentUser.uid) ||
      !AuthService.currentUser
    );
  }

  private initUser(user: FirebaseUser) {
    user.getIdToken().then((token: string) => {
      AuthService.currentToken = token;
      const currentUserInfo: UserInfo = {
        displayName: AuthService.currentUser.displayName,
        email: AuthService.currentUser.email,
        phoneNumber: AuthService.currentUser.email,
        photoURL: AuthService.currentUser.photoURL,
        providerId: AuthService.currentUser.providerId,
        uid: AuthService.currentUser.uid
      };

      this.userService.login(currentUserInfo, token);
      this.wishesList.updateAllWishlist();
    });
  }

  private resetCurrentUser() {
    if (AuthService.currentUser != null) {
      AuthService.currentUser = null;
      AuthService.currentToken = null;
      this.userService.logout();
      this.wishesList.updateAllWishlist();
    }
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let httpHeaders;
    if (AuthService.currentToken) {
      httpHeaders = req.headers.set(
        "Authorization",
        "Bearer " + AuthService.currentToken
      );
    } else {
      httpHeaders = req.headers;
    }

    const newReq = req.clone({
      headers: httpHeaders
    });
    return next.handle(newReq);
  }

  logout() {
    signOut(this.auth);
  }

  isConnected(): Observable<boolean> {
    return user(this.auth).pipe(map((user: FirebaseUser | null) => !!user));
  }
}
