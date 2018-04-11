import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import {AuthService} from '../../service/auth.service';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent implements OnInit {
  public userAuth: Observable<firebase.User>;


  constructor(private auth: AuthService) { }

  ngOnInit() {
    this.userAuth = this.auth.user;
  }

  loginGoogle() {
    this.auth.loginWithGoogle();
  }

  loginFacebook() {
    this.auth.loginWithFacebook();
  }

  loginEmail() {
    this.auth.loginWithMail();
  }
  logout() {
    this.auth.logout();
  }

}
