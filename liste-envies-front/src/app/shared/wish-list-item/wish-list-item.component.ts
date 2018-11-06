import { Component, OnInit, Input } from '@angular/core';
import { WishList } from '../../models/WishList';
import {WishesList} from '../../state/wishes/wishes-list.model';

@Component({
  selector: 'wish-list-item',
  templateUrl: './wish-list-item.component.html',
  styleUrls: ['./wish-list-item.component.scss']
})
export class WishListItemComponent implements OnInit {
  @Input()
  wishlist: WishesList;

  constructor() { }

  ngOnInit() {
  }

}
