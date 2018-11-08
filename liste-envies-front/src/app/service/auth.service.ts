import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { User } from "firebase";
import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from "@angular/common/http";
import { HttpEvent } from "@angular/common/http/src/response";
import { LoginDialogComponent } from "../component/login-dialog/login-dialog.component";
import { MatDialog } from "@angular/material";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { AngularFireAuth } from "@angular/fire/auth";
import { shareReplay } from "rxjs/operators";
import { WishesListService } from "../state/wishes/wishes-list.service";

@Injectable()
export class AuthService implements HttpInterceptor {
  public static currentUser: User;
  public static currentToken: string;

  public user: Observable<User>;
  private _userState: BehaviorSubject<User>;

  constructor(
    private firebaseAuth: AngularFireAuth,
    public dialog: MatDialog,
    private wishesList: WishesListService
  ) {
    this._userState = new BehaviorSubject(null);

    this.user = this._userState.asObservable();

    firebaseAuth.authState.pipe(shareReplay(1)).subscribe(
      (user: User) => {
        console.log("User :", user);
        if (user) {
          AuthService.currentUser = user;
          user.getIdToken().then((token: string) => {
            AuthService.currentToken = token;
            // emit change user only when the token id was getting.
            this._userState.next(AuthService.currentUser);
            this.wishesList.get();
          });
        } else {
          this.resetCurrentUser();
        }
      },
      error => {
        console.error("error with loggin :", error);
        this.resetCurrentUser();
      },
      () => this._userState.complete()
    );
  }

  private resetCurrentUser() {
    AuthService.currentUser = null;
    AuthService.currentToken = null;
    this._userState.next(AuthService.currentUser);
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

    dialogRef.afterClosed().subscribe(result => {
      console.log("The dialog was closed");
    });
  }

  logout() {
    this.firebaseAuth.auth.signOut();
  }
}
