import {Component, Input, OnInit} from '@angular/core';
import {WishItem} from '../../models/WishItem';
import {SwiperConfigInterface} from 'ngx-swiper-wrapper';
import {WishEditComponent} from '../wish-edit/wish-edit.component';
import {MatDialog} from '@angular/material';

@Component({
  selector: 'app-wish-card',
  templateUrl: './wish-card.component.html',
  styleUrls: ['./wish-card.component.scss']
})
export class WishCardComponent implements OnInit {

  @Input() public wishItem: WishItem;
  edit = false;

  public SWIPER_CONFIG: SwiperConfigInterface = {
    direction: 'horizontal',
    slidesPerView: 1,
    navigation: true,
    // effect: 'cube',
    lazy: true,
    // parallax: true,
    pagination: { el: '.swiper-pagination', type: 'bullets',
    clickable: true},
    // cubeEffect: {
    //   slideShadows: false,
    // }
  };

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }

  editWish() {
    const dialogRef = this.dialog.open(WishEditComponent, {
      width: 'auto',
      height: 'auto',
      data: this.wishItem
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result) {
        this.wishItem = Object.assign({}, result);
      }
    });
  }

  cancelEditWish() {
    this.edit = false;
  }

}
