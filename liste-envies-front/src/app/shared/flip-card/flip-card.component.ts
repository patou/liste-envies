import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-flip-card",
  templateUrl: "./flip-card.component.html",
  styleUrls: ["./flip-card.component.scss"],
  standalone: false
})
export class FlipCardComponent implements OnInit {
  @Input()
  public flip = false;

  constructor() {}

  ngOnInit() {}
}
