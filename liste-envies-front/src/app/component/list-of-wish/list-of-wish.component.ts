import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {WishItem} from '../../models/WishItem';
import {transition, trigger, useAnimation} from '@angular/animations';
import {bounceInLeft, fadeInUp} from 'ng-animate';
import {WishEditComponent} from '../wish-edit/wish-edit.component';
import {MatDialog} from '@angular/material';
import {WishListService} from '../../service/wish-list-service';

declare var Macy;

@Component({
  selector: 'app-list-of-wish',
  templateUrl: './list-of-wish.component.html',
  styleUrls: ['./list-of-wish.component.scss'],
  animations: [
    trigger('animateColumn', [transition('* => *', useAnimation(fadeInUp))]),
    trigger('animateItems', [transition('* => *', useAnimation(bounceInLeft))])
  ]
})
export class ListOfWishComponent implements OnInit, OnChanges {

  animateItems: any;
  animateColumn: any;



  @Input() public list: WishItem[];
  public columns = 3;
  public items: WishItem[][] = [];

  constructor(public dialog: MatDialog, public wishApi: WishListService) {
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
