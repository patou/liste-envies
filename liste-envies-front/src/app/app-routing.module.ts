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
import { WishListItemsArchivedResolver } from "./service/wishListItemsArchivedResolve";
import { ReceivedComponent } from "./page/received/received.component";
import { WishListItemsReceivedResolver } from "./service/wishListItemsReceivedResolve";

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
        loadChildren: () =>
          import("app/page/about/about.module").then(m => m.AboutModule)
      },
      {
        path: "connect",
        canActivate: [IsNotConnectedGuard],
        component: ConnectComponent
      },
      {
        path: "received",
        component: ReceivedComponent,
        canActivate: [IsConnectedGuard],
        resolve: {
          whishesItems: WishListItemsReceivedResolver
        }
      },
      {
        path: ":listId",
        resolve: {
          whishList: WishListResolver
        },
        children: [
          { path: "", redirectTo: "toOffer", pathMatch: "full" },
          {
            path: "edit",
            resolve: {
              whishList: WishListResolver
            },
            component: AddUpdateListComponent,
            canActivate: [IsConnectedGuard, IsOwnerGuard]
          },
          {
            path: "archived",
            resolve: {
              whishesItems: WishListItemsArchivedResolver
            },
            component: ListComponent,
            canActivate: [IsConnectedGuard]
          },
          {
            path: "toOffer",
            resolve: {
              whishesItems: WishListItemsResolver
            },
            component: ListComponent
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
