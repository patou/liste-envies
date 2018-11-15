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
    this.newImages = this.imgs ? this.imgs.slice(0) : [];
  }

  public addImg(name: string) {
    if (this.newImages) {
      this.newImages.push(name);
    } else {
      this.newImages = [name];
    }

    this.emitChange();
    this.addImage = "";
  }

  private emitChange() {
    this.onChange.emit(this.newImages);
  }

  public removeImg(index: number) {
    this.newImages.splice(index, 1);
    this.emitChange();
  }
}
