import {Component, Input, OnInit} from '@angular/core';
import {WishItem} from '../../models/WishItem';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'app-list-of-wish',
  templateUrl: './list-of-wish.component.html',
  styleUrls: ['./list-of-wish.component.scss']
})
export class ListOfWishComponent implements OnInit {

  @Input() public list: Observable<WishItem[]>;

  constructor() { }

  ngOnInit() {
  }

}
