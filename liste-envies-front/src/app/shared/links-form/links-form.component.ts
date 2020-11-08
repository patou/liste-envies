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

  public newUrls: UrlsEntity[];

  @Output()
  public onChange = new EventEmitter<UrlsEntity[]>();

  public addUrl: UrlsEntity = { name: "", url: "" };

  constructor() {}

  ngOnInit() {
    this.newUrls = this.urls ? this.urls.slice(0) : [];
    if (!this.newUrls) {
      this.newUrls = [];
    }
  }

  public addLink(url: string, name: string) {
    if (url.length > 0) {
      this.newUrls.push({ name: name, url: url });
      this.onChange.emit(this.newUrls);
      this.addUrl = { name: "", url: "" };
    }
  }
  public removeLink(index: number) {
    this.newUrls.splice(index, 1);
    this.onChange.emit(this.newUrls);
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
