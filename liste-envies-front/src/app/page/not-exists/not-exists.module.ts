import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NotExistsComponent } from "./not-exists.component";
import { MatLegacyCardModule as MatCardModule } from "@angular/material/legacy-card";
import { NgxAuthFirebaseUIModule } from "ngx-auth-firebaseui";
import { MatDividerModule } from "@angular/material/divider";
import { MatLegacyButtonModule as MatButtonModule } from "@angular/material/legacy-button";
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
