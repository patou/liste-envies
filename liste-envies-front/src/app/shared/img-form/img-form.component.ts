import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { UrlsEntity } from "../../models/WishItem";

@Component({
  selector: "app-img-form",
  templateUrl: "./img-form.component.html",
  styleUrls: ["./img-form.component.scss"]
})
export class ImgFormComponent implements OnInit {
  @Input()
  public imgs: string[];

  @Output()
  public onChange = new EventEmitter<string[]>();

  public addImage = "";

  constructor() {}

  ngOnInit() {
    if (!this.imgs) {
      this.imgs = [];
    }
  }

  public addImg(name: string) {
    this.imgs.push(name);
    this.emitChange();
    this.addImage = "";
  }

  private emitChange() {
    this.onChange.emit(this.imgs);
  }

  public removeImg(img: string) {
    const index = this.imgs.indexOf(img);
    this.imgs = this.imgs.slice(index, 1);
    this.emitChange();
  }
}
