import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase';
import {HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {HttpEvent} from '@angular/common/http/src/response';
import {LoginDialogComponent} from '../component/login-dialog/login-dialog.component';
import {MatDialog} from '@angular/material';

@Injectable()
export class AuthService implements HttpInterceptor {
  public static currentUser: firebase.User;
  public static currentToken: string;

  user: Observable<firebase.User>;

  constructor(private firebaseAuth: AngularFireAuth, public dialog: MatDialog) {
    this.user = firebaseAuth.authState;

    this.user.subscribe((user: firebase.User) => {
      if (user) {
        AuthService.currentUser = user;
        user.getIdToken().then((token: string) => {
          console.log('Token :', token, AuthService.currentUser);
          AuthService.currentToken = token;
        });
      } else {
        AuthService.currentUser = null;
        AuthService.currentToken = null;
      }

    });
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    console.log('interceptor : ', AuthService.currentToken, AuthService.currentUser, req);

    let httpHeaders;
    if (AuthService.currentToken) {
      console.log('intercept current token : ', AuthService.currentToken, AuthService.currentUser, req);
      httpHeaders = req.headers.set(
        'Authorization',
        'Bearer ' + AuthService.currentToken
      );
    } else {
      httpHeaders = req.headers;
    }

    const newReq = req.clone({
      headers: httpHeaders
    });
    return next.handle(newReq);
  }

  signup(email: string, password: string) {
    this.firebaseAuth
      .auth
      .createUserWithEmailAndPassword(email, password)
      .then(value => {
        console.log('Success!', value);
      })
      .catch(err => {
        console.log('Something went wrong:', err.message);
      });
  }

  login(email: string, password: string) {
    this.firebaseAuth
      .auth
      .signInWithEmailAndPassword(email, password)
      .then(value => {
        console.log('Nice, it worked!');
      })
      .catch(err => {
        console.log('Something went wrong:', err.message);
      });
  }

  loginWithGoogle() {
    this.firebaseAuth
      .auth
      .signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then(value => {
        console.log('Nice, it worked!');
      })
      .catch(err => {
        console.log('Something went wrong:', err.message);
      });
  }

  loginWithGithub() {
    this.firebaseAuth
      .auth
      .signInWithPopup(new firebase.auth.GithubAuthProvider())
      .then(value => {
        console.log('Nice, it worked!');
      })
      .catch(err => {
        console.log('Something went wrong:', err.message);
      });
  }

  loginWithFacebook() {
    this.firebaseAuth
      .auth
      .signInWithPopup(new firebase.auth.FacebookAuthProvider())
      .then(value => {
        console.log('Nice, it worked!');
      })
      .catch(err => {
        console.log('Something went wrong:', err.message);
      });
  }

  loginWithTwitter() {
    this.firebaseAuth
      .auth
      .signInWithPopup(new firebase.auth.TwitterAuthProvider())
      .then(value => {
        console.log('Nice, it worked!');
      })
      .catch(err => {
        console.log('Something went wrong:', err.message);
      });
  }

  loginWithMail() {
    const dialogRef = this.dialog.open(LoginDialogComponent, {
      width: '300px',
      data: {  }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  logout() {
    this.firebaseAuth
      .auth
      .signOut();
  }

}
