import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {MaterialModule} from '../../shared/material.module';

import { RatingComponent } from './rating/rating.component';
import { FlipCardComponent } from './flip-card/flip-card.component';
import { HtmlEditorComponent } from './html-editor/html-editor.component';
import { QuillModule } from 'ngx-quill';
import { LinksFormComponent } from './links-form/links-form.component';

import { SwiperModule } from 'ngx-swiper-wrapper';
import { SWIPER_CONFIG } from 'ngx-swiper-wrapper';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import {AngularFireModule} from 'angularfire2';
import {AngularFireAuthModule} from 'angularfire2/auth';
import {AuthService} from '../service/auth.service';
import * as firebase from 'firebase';
import AuthProvider = firebase.auth.AuthProvider;
import {AuthProvider as AuthProviderUi, FirebaseUIAuthConfig, AuthMethods, CredentialHelper, FirebaseUIModule} from 'firebaseui-angular';
import {AvatarModule} from 'ngx-avatar';
/*import { Ng2GridDirective } from './ng2-grid/ng2-grid.directive';*/

const DEFAULT_SWIPER_CONFIG: SwiperConfigInterface = {
  direction: 'horizontal',
  slidesPerView: 1,
  navigation: true,
  pagination: false
};

// Initialize Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyAF9dNJPzt0cu8azSICko5XnyiosM1YQL8',
  authDomain: 'liste-envies.firebaseapp.com',
  databaseURL: 'https://liste-envies.firebaseio.com',
  projectId: 'liste-envies',
  storageBucket: 'liste-envies.appspot.com',
  messagingSenderId: '783555297093'
};

const firebaseUiAuthConfig: FirebaseUIAuthConfig = {
  providers: [
    AuthProviderUi.Google,
    AuthProviderUi.Facebook,
    AuthProviderUi.Twitter,
    AuthProviderUi.Github,
    AuthProviderUi.Password
  ],
  method: AuthMethods.Popup,
  credentialHelper: CredentialHelper.OneTap
};

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MaterialModule,
    QuillModule,
    SwiperModule,
    AvatarModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    FirebaseUIModule.forRoot(firebaseUiAuthConfig)
  ],
  declarations: [RatingComponent, FlipCardComponent, HtmlEditorComponent, LinksFormComponent/*, Ng2GridDirective*/],
  exports: [
    CommonModule,
    BrowserModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MaterialModule,
    QuillModule,
    RatingComponent,
    FlipCardComponent,
    HtmlEditorComponent,
    LinksFormComponent,
    FirebaseUIModule,
    AvatarModule,
    SwiperModule/*,
    Ng2GridDirective*/
  ],
  providers: [
    {
      provide: SWIPER_CONFIG,
      useValue: DEFAULT_SWIPER_CONFIG
    },
    AuthService
  ]
})
export class SharedModule { }
