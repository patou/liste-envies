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

  public newImages: string[];

  @Output()
  public onChange = new EventEmitter<string[]>();

  public addImage = "";

  constructor() {}

  ngOnInit() {
    this.newImages = this.imgs.slice(0);
    if (!this.newImages) {
      this.newImages = [];
    }
  }

  public addImg(name: string) {
    this.newImages.push(name);
    this.emitChange();
    this.addImage = "";
  }

  private emitChange() {
    this.onChange.emit(this.newImages);
  }

  public removeImg(img: string) {
    const index = this.newImages.indexOf(img);
    this.newImages = this.newImages.slice(index, 1);
    this.emitChange();
  }
}
