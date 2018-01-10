import { Component, OnInit } from '@angular/core';
import {WishListService} from "../service/wish-list-service";
import {Observable} from "rxjs/Observable";
import {WishList} from "../models/wish-list";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  list: Observable<WishList[]>;
  constructor(private wishListService: WishListService) { }

  ngOnInit() {
    this.list = this.wishListService.list();
  }

}
