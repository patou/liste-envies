import {Component, Input, OnInit} from '@angular/core';
import {WishItem} from "../../models/WishItem";

@Component({
  selector: 'app-wish-edit',
  templateUrl: './wish-edit.component.html',
  styleUrls: ['./wish-edit.component.scss']
})
export class WishEditComponent implements OnInit {
  
  @Input() public wishItem: WishItem;

  constructor() { }

  ngOnInit() {
  }

}
