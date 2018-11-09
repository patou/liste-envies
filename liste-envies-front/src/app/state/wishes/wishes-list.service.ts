import { Injectable } from '@angular/core';
import { ID } from '@datorama/akita';
import { WishesListStore } from './wishes-list.store';
import { createWishesList, WishesList } from './wishes-list.model';
import { WishListApiService } from '../../service/wish-list-api.service';
import { throttle, Debounce } from 'lodash-decorators';

@Injectable({ providedIn: 'root' })
export class WishesListService {
  constructor(
    private wishesListStore: WishesListStore,
    private wishListService: WishListApiService
  ) {}

  @Debounce(500)
  get() {
    // console.trace('WishesListService.get()');
    this.wishesListStore.setLoading(true);
    this.wishListService.listAll().subscribe(entities => {
      const wishesListConverted: WishesList[] = entities.map<WishesList>(list =>
        createWishesList(list)
      );

      console.log('get List All :', wishesListConverted);

      this.wishesListStore.set(wishesListConverted);
      this.wishesListStore.setLoading(false);
    });
  }

  add(wishesList: WishesList) {
    this.wishesListStore.add(wishesList);
  }

  update(id, wishesList: Partial<WishesList>) {
    this.wishesListStore.update(id, wishesList);
  }

  remove(id: ID) {
    this.wishesListStore.remove(id);
  }
}
