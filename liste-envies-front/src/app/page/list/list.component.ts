import {ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
/*
import { MasonryOptions } from 'ngx-masonry';
*/
import {WishListService} from '../../service/wish-list-service';
import {Observable} from 'rxjs/Observable';
import {WishList} from '../../models/WishList';
import {WishItem} from '../../models/WishItem';
import {ActivatedRoute} from '@angular/router';
import {AuthService} from '../../service/auth.service';
import * as firebase from 'firebase';
import {RouteData, RouteParams} from 'angular-xxl';
import {WishEditComponent} from '../../component/wish-edit/wish-edit.component';
import {MatDialog} from '@angular/material';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListComponent implements OnInit, OnChanges {


  @RouteData('whishesItems')
  list$: Observable<WishItem[]>;


  @RouteData('whishList', {observable: false})
  whishList: WishList;

  @Input('list')
  list: WishList;

  @Input('items')
  items: Observable<WishItem[]>;

  @Input('demo')
  demo = false;


  public userAuth: Observable<firebase.User>;

  @RouteParams('listId', {observable: false}) public listId: string;

  constructor(private wishListService: WishListService, private route: ActivatedRoute, private auth: AuthService, public dialog: MatDialog) {

  }

  ngOnInit() {
    this.userAuth = this.auth.user;

    if (this.demo) {
      
      this.list$ = this.items;
      return;
    }

    // if no demo, do the following

    this.userAuth.subscribe(value => {
      this.loadList();
      console.log('user AUTH NEXT in list page / ', value);
    });


  }

  private loadList() {
    if (this.demo) return;
    
    this.list$ = this.wishListService.wishes(this.route.snapshot.params['listId']);
  }

  addWish() {
    if (this.demo) return;

    this.dialog.open(WishEditComponent, {
      width: 'auto',
      height: 'auto',
      maxHeight: '90%',
      maxWidth: '100%',
      panelClass: 'matDialogContent'
    }).afterClosed().subscribe((result: WishItem) => {
      console.log('The dialog was closed');
      if (result) {
        this.wishListService.createWish(this.listId, result).subscribe((Wish: WishItem) =>  {
          // todo juste add to list rather than reload all.
          this.loadList();
        });
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('On change :', changes);
    this.whishList = changes.list.currentValue;
  }

}

