import { Component, Inject, Input, OnInit } from "@angular/core";
import { UrlsEntity, WishItem } from "../../models/WishItem";
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions
} from "@angular/material/dialog";
import { CdkScrollable } from "@angular/cdk/scrolling";
import {
  MatFormField,
  MatLabel,
  MatInput,
  MatHint,
  MatSuffix
} from "@angular/material/input";
import { FormsModule } from "@angular/forms";
import { MatIcon } from "@angular/material/icon";
import { MatSlideToggle } from "@angular/material/slide-toggle";
import { RatingComponent } from "../../shared/rating/rating.component";
import { HtmlEditorComponent } from "../../shared/html-editor/html-editor.component";
import { ImgFormComponent } from "../../shared/img-form/img-form.component";
import { LinksFormComponent } from "../../shared/links-form/links-form.component";
import { MatButton } from "@angular/material/button";

@Component({
  selector: "app-wish-edit",
  templateUrl: "./wish-edit.component.html",
  styleUrls: ["./wish-edit.component.scss"],
  imports: [
    MatDialogTitle,
    CdkScrollable,
    MatDialogContent,
    MatFormField,
    MatLabel,
    MatInput,
    FormsModule,
    MatHint,
    MatIcon,
    MatSuffix,
    MatSlideToggle,
    RatingComponent,
    HtmlEditorComponent,
    ImgFormComponent,
    LinksFormComponent,
    MatDialogActions,
    MatButton
  ]
})
export class WishEditComponent implements OnInit {
  public wishItem: WishItem;
  public isAddWhish: boolean;

  constructor(
    public dialogRef: MatDialogRef<WishEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    if (this.data) {
      this.isAddWhish = false;
      this.wishItem = {
        description: "",
        price: "",
        pictures: [],
        urls: [],
        rating: 0,
        ...this.data
      };
    } else {
      this.isAddWhish = true;
      this.wishItem = {
        label: "",
        description: "",
        price: "",
        pictures: [],
        urls: [],
        allreadyGiven: false,
        rating: 0
      };
    }
  }

  cancelEditWish() {
    this.dialogRef.close(null);
  }

  updateEditWish() {
    this.dialogRef.close(this.wishItem);
  }

  updatesPictures($event: string[]) {
    this.wishItem.pictures = $event;
  }

  updatesLinks($event: UrlsEntity[]) {
    this.wishItem.urls = $event;
  }
}
