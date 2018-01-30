import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {WishList} from '../models/wish-list';
import {WishItem} from '../models/WishItem';

@Injectable()
export class WishListService {
  constructor(private http: HttpClient) {
  }

  list(): Observable<WishList[]> {
    return this.http.get<WishList[]>('/api/list');
  }

  wishes(name: string): Observable<WishItem[]> {
    return this.http.get<WishItem[]>('/api/wishes/' + name);
  }
}