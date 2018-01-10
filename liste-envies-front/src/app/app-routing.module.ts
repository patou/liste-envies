import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PageComponent} from "./page/page.component";
import {HomeComponent} from "./home/home.component";
import {ListComponent} from "./list/list.component";

const routes: Routes = [{
  path: '', component: PageComponent, children: [
    { path: '', component: HomeComponent },
    { path: ':listId', component: ListComponent }
  ]
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
