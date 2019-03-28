import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PageComponent } from "./component/page/page.component";
import { HomeComponent } from "./page/home/home.component";
import { ListComponent } from "./page/list/list.component";
import { AddUpdateListComponent } from "./page/add-list/add-update-list.component";
import { WishListResolver } from "./service/wishListResolve";
import { WishListItemsResolver } from "./service/wishListItemsResolve";
import { IsConnectedGuard } from "./service/is-connected.guard";
import { ConnectComponent } from "./page/connect/connect.component";
import { IsNotConnectedGuard } from "./service/is-not-connected.guard";
import { IsOwnerGuard } from "./service/is-owner.guard";

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
        component: AddUpdateListComponent,
        canActivate: [IsConnectedGuard],
        resolve: {
          whishList: WishListResolver
        }
      },
      {
        path: "about",
        loadChildren: "app/page/about/about.module#AboutModule"
      },
      {
        path: "connect",
        canActivate: [IsNotConnectedGuard],
        component: ConnectComponent
      },
      {
        path: ":listId",
        resolve: {
          whishList: WishListResolver,
          whishesItems: WishListItemsResolver
        },
        children: [
          { path: "", component: ListComponent },
          {
            path: "edit",
            resolve: {
              whishList: WishListResolver
            },
            component: AddUpdateListComponent,
            canActivate: [IsConnectedGuard, IsOwnerGuard]
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
