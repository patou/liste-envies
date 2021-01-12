import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NotExistsComponent } from "./not-exists.component";
import { MatCardModule } from "@angular/material/card";
import { NgxAuthFirebaseUIModule } from "ngx-auth-firebaseui";
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
  declarations: [NotExistsComponent],
  imports: [
    CommonModule,
    MatCardModule,
    NgxAuthFirebaseUIModule,
    MatDividerModule,
    MatButtonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class NotExistsModule {}
