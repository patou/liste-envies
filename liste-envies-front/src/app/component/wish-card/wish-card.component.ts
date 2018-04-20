import {Component, Input, OnInit} from '@angular/core';
import {WishItem} from '../../models/WishItem';
import {SwiperConfigInterface} from 'ngx-swiper-wrapper';
import {WishEditComponent} from '../wish-edit/wish-edit.component';
import {MatDialog} from '@angular/material';
import {transition, trigger, useAnimation} from '@angular/animations';
import {bounceInUp} from 'ng-animate/lib';

@Component({
  selector: 'app-wish-card',
  templateUrl: './wish-card.component.html',
  styleUrls: ['./wish-card.component.scss'],
  animations: [
    trigger('animateWishCard', [transition('* => *', useAnimation(bounceInUp))])
  ]
})
export class WishCardComponent implements OnInit {

  animateWishCard: any;

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
      maxHeight: '90%',
      maxWidth: '100%',
      panelClass: 'matDialogContent',
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
