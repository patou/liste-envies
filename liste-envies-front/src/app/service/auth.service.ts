import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { User, UserInfo } from "firebase";
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from "@angular/common/http";
import { LoginDialogComponent } from "../component/login-dialog/login-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { AngularFireAuth } from "@angular/fire/auth";
import { distinct, map, pluck } from "rxjs/operators";
import { WishesListService } from "../state/wishes/wishes-list.service";
import { UserService } from "../state/app/user.service";
import { UserQuery } from "../state/app/user.query";
import { WishList } from "../models/WishList";
import { UserState } from "../state/app/user.store";

@Injectable()
export class AuthService implements HttpInterceptor {
  public static currentUser: User;
  public static currentToken: string;

  public user: Observable<User>;

  constructor(
    private firebaseAuth: AngularFireAuth,
    public dialog: MatDialog,
    private wishesList: WishesListService,
    private userService: UserService,
    private userQuery: UserQuery
  ) {
    this.user = this.userQuery.select().pipe(pluck<UserState, User>("user"));

    this.firebaseAuth.authState
      .pipe(distinct((user: User) => user?.uid))
      .subscribe(
        (user: User) => {
          if (user) {
            if (
              (AuthService.currentUser &&
                user.uid !== AuthService.currentUser.uid) ||
              !AuthService.currentUser
            ) {
              user.getIdToken().then((token: string) => {
                AuthService.currentToken = token;
                // emit change user only when the token id was getting.
                const user1: UserInfo = {
                  displayName: AuthService.currentUser.displayName,
                  email: AuthService.currentUser.email,
                  phoneNumber: AuthService.currentUser.email,
                  photoURL: AuthService.currentUser.photoURL,
                  providerId: AuthService.currentUser.providerId,
                  uid: AuthService.currentUser.uid
                };

                this.userService.login(user1, token);
                this.wishesList.updateAllWishlist();
              });
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

  openLoginPopUp() {
    const dialogRef = this.dialog.open(LoginDialogComponent, {
      width: "80%",
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {});
  }

  notifications(): Observable<Notification[]> {
    return null;
  }

  logout() {
    this.firebaseAuth.signOut();
  }

  isConnected(): Observable<boolean> {
    return this.firebaseAuth.authState.pipe(map<User, boolean>(user => !!user));
  }
}
