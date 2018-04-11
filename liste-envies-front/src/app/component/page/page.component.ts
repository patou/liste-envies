import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import {AuthService} from '../../service/auth.service';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent implements OnInit {

  constructor(private auth: AuthService) { }

  ngOnInit() {
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
