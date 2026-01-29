import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NotExistsComponent } from "./not-exists.component";
import { MatCardModule } from "@angular/material/card";
import { MatDividerModule } from "@angular/material/divider";
import { MatButtonModule } from "@angular/material/button";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    path: "",
    component: NotExistsComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    MatDividerModule,
    MatButtonModule,
    RouterModule.forChild(routes),
    NotExistsComponent
  ],
  exports: [RouterModule]
})
export class NotExistsModule {}
