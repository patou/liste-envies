import { Component, OnInit, Input } from "@angular/core";
import { WishList } from "../../models/WishList";

@Component({
  selector: "wish-list-item",
  templateUrl: "./wish-list-item.component.html",
  styleUrls: ["./wish-list-item.component.scss"]
})
export class WishListItemComponent implements OnInit {
  @Input()
  wishlist: WishList;

  constructor() {}

  ngOnInit() {}
}
