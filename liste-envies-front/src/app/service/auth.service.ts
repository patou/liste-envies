import { Injectable } from "@angular/core";
import { AsyncSubject, Observable } from "rxjs";
import { User, UserInfo } from "firebase";
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from "@angular/common/http";
import { MatDialog } from "@angular/material/dialog";
import { AngularFireAuth } from "@angular/fire/auth";
import { distinct, map, pluck, tap } from "rxjs/operators";
import { WishesListService } from "../state/wishes/wishes-list.service";
import { UserService } from "../state/app/user.service";
import { UserQuery } from "../state/app/user.query";
import { UserState } from "../state/app/user.store";

@Injectable()
export class AuthService implements HttpInterceptor {
  public static currentUser: User;
  public static currentToken: string;

  public user: Observable<User>;
  private firebaseAuthInit$: AsyncSubject<boolean> = new AsyncSubject<
    boolean
  >();
  private _init: boolean = false;

  constructor(
    private firebaseAuth: AngularFireAuth,
    public dialog: MatDialog,
    private wishesList: WishesListService,
    private userService: UserService,
    private userQuery: UserQuery
  ) {
    this.user = this.userQuery.select().pipe(pluck<UserState, User>("user"));

    this.subscribeToAuthState();
  }

  init(): boolean | Promise<boolean> {
    return this._init ? true : this.subscribeToAuthState();
  }

  private subscribeToAuthState(): Promise<boolean> {
    this.firebaseAuth.authState
      .pipe(
        distinct((user: User) => user?.uid),
        tap(this.emitInitEventForFirstTime())
      )
      .subscribe(
        (user: User) => {
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
    return this.firebaseAuthInit$.toPromise();
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

  private isADifferentUserOrIsNotInitialised(user: firebase.User) {
    return (
      (AuthService.currentUser && user.uid !== AuthService.currentUser.uid) ||
      !AuthService.currentUser
    );
  }

  private initUser(user: firebase.User) {
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
    this.firebaseAuth.signOut();
  }

  isConnected(): Observable<boolean> {
    return this.firebaseAuth.authState.pipe(map<User, boolean>(user => !!user));
  }
}
