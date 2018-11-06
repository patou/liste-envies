import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { WishesListStore, WishesListState } from './wishes-list.store';
import { WishesList } from './wishes-list.model';

@Injectable({
  providedIn: 'root'
})
export class WishesListQuery extends QueryEntity<WishesListState, WishesList> {

  constructor(protected store: WishesListStore) {
    super(store);
  }

}
