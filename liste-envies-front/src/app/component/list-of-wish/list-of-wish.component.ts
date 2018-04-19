import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {WishItem} from '../../models/WishItem';
import {NgxMasonryOptions} from 'ngx-masonry';

declare var Macy;

@Component({
  selector: 'app-list-of-wish',
  templateUrl: './list-of-wish.component.html',
  styleUrls: ['./list-of-wish.component.scss']
})
export class ListOfWishComponent implements OnInit, OnChanges {

  public masonryOptions: NgxMasonryOptions = {
    transitionDuration: '0.8s'
  };


  @Input() public list: WishItem[];
  public columns = 3;
  public items: WishItem[][] = [];

  constructor() {
  }

  ngOnInit() {
    console.log('On init wishItems ', this.list);
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    if (changes.list && changes.list.currentValue) {
      this.items = changes.list.currentValue.reduce((acc, val, index) => {
        acc[index % acc.length].push(val);
        return acc;
      }, Array(this.columns).fill(0).map(() => []));
    }
  }

}
