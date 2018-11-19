import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PageComponent } from "./component/page/page.component";
import { HomeComponent } from "./page/home/home.component";
import { ListComponent } from "./page/list/list.component";
import { AddListComponent } from "./page/add-list/add-list.component";
import { WishListResolver } from "./service/wishListResolve";
import { WishListItemsResolver } from "./service/wishListItemsResolve";

const routes: Routes = [
  {
    path: "",
    component: PageComponent,
    children: [
      {
        path: "",
        component: HomeComponent,
        resolve: {
          whishList: WishListResolver
        }
      },
      {
        path: "addList",
        component: AddListComponent
      },
      {
        path: ":listId",
        resolve: {
          whishList: WishListResolver,
          whishesItems: WishListItemsResolver
        },
        component: ListComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
