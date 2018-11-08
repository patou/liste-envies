import { Component, Input, OnInit } from "@angular/core";
import { UrlsEntity } from "../../models/WishItem";

@Component({
  selector: "app-links-form",
  templateUrl: "./links-form.component.html",
  styleUrls: ["./links-form.component.scss"]
})
export class LinksFormComponent implements OnInit {
  @Input()
  public urls: UrlsEntity[];

  public addUrl: UrlsEntity = { name: "", url: "" };

  constructor() {}

  ngOnInit() {
    if (!this.urls) {
      this.urls = [];
    }
  }

  public addLink(url: string, name: string) {
    this.urls.push({ name: name, url: url });
  }
}
