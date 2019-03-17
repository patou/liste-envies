import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { User, UserInfo } from "firebase";
import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from "@angular/common/http";
import { HttpEvent } from "@angular/common/http/src/response";
import { LoginDialogComponent } from "../component/login-dialog/login-dialog.component";
import { MatDialog } from "@angular/material";
import { AngularFireAuth } from "@angular/fire/auth";
import { pluck } from "rxjs/operators";
import { WishesListService } from "../state/wishes/wishes-list.service";
import { UserService } from "../state/app/user.service";
import { UserQuery } from "../state/app/user.query";
import { WishList } from "../models/WishList";

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
    this.user = this.userQuery.select().pipe(pluck("user"));

    firebaseAuth.authState.subscribe(
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
              this.wishesList.get();
            });
          }

          AuthService.currentUser = user;
        } else {
          this.resetCurrentUser();
        }
      },
      error => {
        console.error("error with loggin :", error);
        this.resetCurrentUser();
      }
    );
  }

  private resetCurrentUser() {
    AuthService.currentUser = null;
    AuthService.currentToken = null;
    this.userService.logout();
    this.wishesList.get();
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
      width: "400px",
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {});
  }

  notifications(): Observable<Notification[]> {
    return null;
  }

  logout() {
    this.firebaseAuth.auth.signOut();
  }

  isConnected(): boolean {
    return AuthService.currentUser !== null
  }
}
