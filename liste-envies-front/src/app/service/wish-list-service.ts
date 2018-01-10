import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import {WishList} from "../models/wish-list";

@Injectable()
export class WishListService {
  constructor(private http: HttpClient) {
  }

  list():Observable<WishList[]> {
    return this.http.get<WishList[]>('/api/list')
  }
}
