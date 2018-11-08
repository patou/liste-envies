import { Component } from "@angular/core";
import { MatIconRegistry } from "@angular/material";
import { WishesListService } from "./state/wishes/wishes-list.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  title = "app";

  constructor(
    public matIconRegistry: MatIconRegistry,
    private wishesListService: WishesListService
  ) {
    matIconRegistry.registerFontClassAlias("fa", "fa");
  }
}
