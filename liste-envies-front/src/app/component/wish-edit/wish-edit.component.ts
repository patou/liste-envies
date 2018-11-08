import { Component, Inject, Input, OnInit } from "@angular/core";
import { WishItem } from "../../models/WishItem";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";

@Component({
  selector: "app-wish-edit",
  templateUrl: "./wish-edit.component.html",
  styleUrls: ["./wish-edit.component.scss"]
})
export class WishEditComponent implements OnInit {
  public wishItem: WishItem;

  constructor(
    public dialogRef: MatDialogRef<WishEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    if (this.data) {
      this.wishItem = this.data;
    } else {
      this.wishItem = {
        label: "",
        description: "",
        price: "",
        pictures: null,
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
}
