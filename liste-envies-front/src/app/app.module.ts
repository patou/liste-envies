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
import { ListOfWishComponent } from "./component/list-of-wish/list-of-wish.component";
import { WishEditComponent } from "./component/wish-edit/wish-edit.component";
import { AddUpdateListComponent } from "./page/add-list/add-update-list.component";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { AuthService } from "./service/auth.service";
import { LoginDialogComponent } from "./component/login-dialog/login-dialog.component";
import { WishListResolver } from "./service/wishListResolve";
import { HttpRestModule } from "ngx-http-annotations";
import { PageNavComponent } from "./component/page-nav/page-nav.component";
import { LayoutModule } from "@angular/cdk/layout";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MatSidenavModule } from "@angular/material/sidenav";
import {
  MAT_SNACK_BAR_DEFAULT_OPTIONS,
  MatSnackBarHorizontalPosition
} from "@angular/material/snack-bar";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MomentModule } from "ngx-moment";
import "moment/locale/fr";
import { WishListItemsResolver } from "./service/wishListItemsResolve";
import { AkitaNgDevtools } from "@datorama/akita-ngdevtools";
import { environment } from "../environments/environment";
import { enableAkitaProdMode } from "@datorama/akita";
import { NotificationsComponent } from "./component/notifications/notifications.component";
import { akitaConfig } from "@datorama/akita";
import { ReactiveFormsModule } from "@angular/forms";
import { ConnectComponent } from "./page/connect/connect.component";
import { WishListItemsArchivedResolver } from "./service/wishListItemsArchivedResolve";
import { ReceivedComponent } from "./page/received/received.component";
import { WishListItemsReceivedResolver } from "./service/wishListItemsReceivedResolve";
import {NgxAuthFirebaseUIModule} from "ngx-auth-firebaseui";
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
    ListOfWishComponent,
    WishEditComponent,
    AddUpdateListComponent,
    LoginDialogComponent,
    PageNavComponent,
    NotificationsComponent,
    ConnectComponent,
    ReceivedComponent
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
    ReactiveFormsModule,
    environment.production ? [] : AkitaNgDevtools.forRoot(),
    NgxAuthFirebaseUIModule.forRoot(environment.firebaseConfig)
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
    WishListItemsArchivedResolver,
    WishListItemsReceivedResolver,
    { provide: LOCALE_ID, useValue: "fr" },
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: { duration: 2500, horizontalPosition: "right" }
    }
  ],
  entryComponents: [WishEditComponent, LoginDialogComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
