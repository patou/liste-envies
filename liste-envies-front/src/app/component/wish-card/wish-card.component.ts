import {Component, Input, OnInit} from '@angular/core';
import {WishItem} from '../../models/WishItem';
import {SwiperConfigInterface} from 'ngx-swiper-wrapper';

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
    effect: 'cube',
    lazy: true,
    parallax: true,
    pagination: { el: '.swiper-pagination', type: 'bullets',
    clickable: true},
    cubeEffect: {
      slideShadows: false,
    }
  };

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
