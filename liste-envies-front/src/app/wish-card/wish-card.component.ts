import {Component, Input, OnInit} from '@angular/core';
import {WishItem} from '../models/WishItem';

@Component({
  selector: 'app-wish-card',
  templateUrl: './wish-card.component.html',
  styleUrls: ['./wish-card.component.scss']
})
export class WishCardComponent implements OnInit {

  @Input() public wishItem: WishItem;
  edit: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  editWish() {
    this.edit = true;
  }

  cancelEditWish() {
    this.edit = false;
  }

}
