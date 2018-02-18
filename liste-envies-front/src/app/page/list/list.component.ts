import {Component, OnDestroy, OnInit} from '@angular/core';
import { MasonryOptions } from 'ngx-masonry';
import {WishListService} from '../../service/wish-list-service';
import {Observable} from 'rxjs/Observable';
import {WishList} from '../../models/WishList';
import {WishItem} from '../../models/WishItem';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy {

  list: Observable<WishItem[]>;

  id: number;
  private sub: any;


  public masonryOptions: MasonryOptions = {
    transitionDuration: '0.8s',
    gutter: 10,
    columnWidth: 200
  };


  public listId: string;

  constructor(private wishListService: WishListService, private route: ActivatedRoute) {

  }

  ngOnInit() {

    this.sub = this.route.params.subscribe(params => {
      this.listId = params['listId'];
      this.list = this.wishListService.wishes(params['listId']);
    });


  }

  ngOnDestroy() {
    this.sub.unsubscribe();


  }
}

