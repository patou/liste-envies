import { Component, OnInit } from "@angular/core";
import { PageNavComponent } from "../page-nav/page-nav.component";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: "app-page",
  templateUrl: "./page.component.html",
  styleUrls: ["./page.component.scss"],
  imports: [PageNavComponent, RouterOutlet]
})
export class PageComponent {}
