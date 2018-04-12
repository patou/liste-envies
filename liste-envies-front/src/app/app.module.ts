import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { PageComponent } from './component/page/page.component';
import { HomeComponent } from './page/home/home.component';
import { SharedModule} from "./shared/shared.module";
import { ListComponent } from './page/list/list.component';
import { WishListService } from "./service/wish-list-service";
import { WishCardComponent } from './component/wish-card/wish-card.component';
import { ListOfWishComponent } from './component/list-of-wish/list-of-wish.component';
import { WishEditComponent } from './component/wish-edit/wish-edit.component';
import { AddListComponent } from './page/add-list/add-list.component';
import {HTTP_INTERCEPTORS, HttpInterceptor} from '@angular/common/http';
import {AuthService} from './service/auth.service';
import { LoginDialogComponent } from './component/login-dialog/login-dialog.component';


@NgModule({
  declarations: [
    AppComponent,
    PageComponent,
    HomeComponent,
    ListComponent,
    WishCardComponent,
    ListOfWishComponent,
    WishEditComponent,
    AddListComponent,
    LoginDialogComponent
  ],
  imports: [
    AppRoutingModule,
    SharedModule
  ],
  providers: [WishListService, {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthService,
    multi: true
  }],
  entryComponents: [WishEditComponent, LoginDialogComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
