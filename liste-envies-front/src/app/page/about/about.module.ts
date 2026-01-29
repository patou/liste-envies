import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AboutPageComponent } from "./about-page.component";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    path: "",
    component: AboutPageComponent
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), AboutPageComponent],
  exports: [RouterModule]
})
export class AboutModule {}
