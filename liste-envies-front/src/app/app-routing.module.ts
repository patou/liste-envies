import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PageComponent} from './component/page/page.component';
import {HomeComponent} from './page/home/home.component';
import {ListComponent} from './page/list/list.component';
import {AddListComponent} from './page/add-list/add-list.component';

const routes: Routes = [{
  path: '', component: PageComponent, children: [
    { path: '', component: HomeComponent },
    { path: 'addList', component: AddListComponent },
    { path: ':listId', component: ListComponent }
  ]
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
