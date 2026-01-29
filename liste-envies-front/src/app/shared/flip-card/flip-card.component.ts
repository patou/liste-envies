import { Component, Input, OnInit } from "@angular/core";
import { NgClass } from "@angular/common";

@Component({
  selector: "app-flip-card",
  templateUrl: "./flip-card.component.html",
  styleUrls: ["./flip-card.component.scss"],
  imports: [NgClass]
})
export class FlipCardComponent implements OnInit {
  @Input()
  public flip = false;

  constructor() {}

  ngOnInit() {}
}
