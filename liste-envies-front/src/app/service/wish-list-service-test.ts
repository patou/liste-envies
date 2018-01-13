import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import {WishList} from '../models/wish-list';
const mockList: WishList[] = [{name: 'list', title: 'List', isOwner: false}];
@Injectable()
export class WishListServiceTest {
  constructor(private http: HttpClient) {
  }


  list(): Observable<WishList[]> {
    return Observable.of(mockList);
  }
}
