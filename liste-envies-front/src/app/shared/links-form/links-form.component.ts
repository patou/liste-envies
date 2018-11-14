import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { UrlsEntity } from "../../models/WishItem";

@Component({
  selector: "app-links-form",
  templateUrl: "./links-form.component.html",
  styleUrls: ["./links-form.component.scss"]
})
export class LinksFormComponent implements OnInit {
  @Input()
  public urls: UrlsEntity[];

  @Output()
  public onChange = new EventEmitter<UrlsEntity[]>();

  public addUrl: UrlsEntity = { name: "", url: "" };

  constructor() {}

  ngOnInit() {
    if (!this.urls) {
      this.urls = [];
    }
  }

  public addLink(url: string, name: string) {
    this.urls.push({ name: name, url: url });
    this.onChange.emit(this.urls);
    this.addUrl = { name: "", url: "" };
  }
  public removeLink(url: UrlsEntity) {
    const index = this.urls.indexOf(url);
    this.urls = this.urls.slice(index, 1);
    this.onChange.emit(this.urls);
  }

  onChangeUrl(url: string) {
    if (this.addUrl.name === "") {
      this.addUrl.name = this.getHostName(url);
    }
  }

  private getHostName(url) {
    const match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);
    if (
      match != null &&
      match.length > 2 &&
      typeof match[2] === "string" &&
      match[2].length > 0
    ) {
      return match[2];
    } else {
      return "";
    }
  }
}
