import { LOCALE_ID, NgModule } from "@angular/core";
import { registerLocaleData } from "@angular/common";
import localeFr from "@angular/common/locales/fr";

import { AppRoutingModule } from "./app-routing.module";

import { AppComponent } from "./app.component";
import { PageComponent } from "./component/page/page.component";
import { HomeComponent } from "./page/home/home.component";
import { SharedModule } from "./shared/shared.module";
import { ListComponent } from "./page/list/list.component";
import { WishListApiService } from "./service/wish-list-api.service";
import { WishCardComponent } from "./component/wish-card/wish-card.component";
import { ListOfWishComponent } from "./component/list-of-wish/list-of-wish.component";
import { WishEditComponent } from "./component/wish-edit/wish-edit.component";
import { AddListComponent } from "./page/add-list/add-list.component";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { AuthService } from "./service/auth.service";
import { LoginDialogComponent } from "./component/login-dialog/login-dialog.component";
import { WishListResolver } from "./service/wishListResolve";
import { HttpRestModule } from "ngx-http-annotations";
import { PageNavComponent } from "./component/page-nav/page-nav.component";
import { LayoutModule } from "@angular/cdk/layout";
import {
  MatButtonModule,
  MatIconModule,
  MatListModule,
  MatSidenavModule,
  MatToolbarModule
} from "@angular/material";
import { MomentModule } from "ngx-moment";
import "moment/locale/fr";
import { WishListItemsResolver } from "./service/wishListItemsResolve";
import { AkitaNgDevtools } from "@datorama/akita-ngdevtools";
import { environment } from "../environments/environment";
import { enableAkitaProdMode } from "@datorama/akita";
import { NotificationsComponent } from "./component/notifications/notifications.component";
import { akitaConfig } from "@datorama/akita";
akitaConfig({
  resettable: true
});

// the second parameter 'fr' is optional
registerLocaleData(localeFr, "fr");

if (environment.production) {
  enableAkitaProdMode();
}

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
    LoginDialogComponent,
    PageNavComponent,
    NotificationsComponent
  ],
  imports: [
    AppRoutingModule,
    SharedModule,
    HttpRestModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MomentModule,
    environment.production ? [] : AkitaNgDevtools.forRoot()
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthService,
      multi: true
    },
    WishListApiService,
    WishListResolver,
    WishListItemsResolver,
    { provide: LOCALE_ID, useValue: "fr" }
  ],
  entryComponents: [WishEditComponent, LoginDialogComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
