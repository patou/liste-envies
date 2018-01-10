import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { PageComponent } from './page/page.component';
import { HomeComponent } from './home/home.component';
import { SharedModule} from "./shared/shared.module";
import { ListComponent } from './list/list.component';
import { WishListService } from "./service/wish-list-service";


@NgModule({
  declarations: [
    AppComponent,
    PageComponent,
    HomeComponent,
    ListComponent
  ],
  imports: [
    AppRoutingModule,
    SharedModule
  ],
  providers: [WishListService],
  bootstrap: [AppComponent]
})
export class AppModule { }
