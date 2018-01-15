import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { PageComponent } from './page/page.component';
import { HomeComponent } from './home/home.component';
import { SharedModule} from "./shared/shared.module";
import { ListComponent } from './list/list.component';
import { WishListService } from "./service/wish-list-service";
import { WishCardComponent } from './wish-card/wish-card.component';
import { FlipCardComponent } from './flip-card/flip-card.component';


@NgModule({
  declarations: [
    AppComponent,
    PageComponent,
    HomeComponent,
    ListComponent,
    WishCardComponent,
    FlipCardComponent
  ],
  imports: [
    AppRoutingModule,
    SharedModule
  ],
  providers: [WishListService],
  bootstrap: [AppComponent]
})
export class AppModule { }
