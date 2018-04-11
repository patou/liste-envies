import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase';
import {HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {HttpEvent} from '@angular/common/http/src/response';

@Injectable()
export class AuthService implements HttpInterceptor {
  user: Observable<firebase.User>;
  currentUser: firebase.User;
  currentToken: string;

  constructor(private firebaseAuth: AngularFireAuth) {
    this.user = firebaseAuth.authState;

    this.user.subscribe((user: firebase.User) => {
      if (user) {
        this.currentUser = user;
        user.getIdToken().then((token: string) => {
          console.log('Token :', token, this.currentUser);
          this.currentToken = token;
        });
      } else {
        this.currentUser = null;
        this.currentToken = null;
      }

    });
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    let httpHeaders;
    if (this.currentToken) {
      console.log('intercept current token : ', this.currentToken, this.currentUser, req);
      httpHeaders = req.headers.set(
        'Authorization',
        'Bearer ' + this.currentToken
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
    this.firebaseAuth
      .auth
      .signInWithPopup(new firebase.auth.EmailAuthProvider())
      .then(value => {
        console.log('Nice, it worked!');
      })
      .catch(err => {
        console.log('Something went wrong:', err.message);
      });
  }

  logout() {
    this.firebaseAuth
      .auth
      .signOut();
  }

}
