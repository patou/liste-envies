import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import "rxjs/add/observable/of";
import { WishList } from "../models/WishList";
const mockList: WishList[] = [{ name: "list", title: "List", owner: false }];

@Injectable()
export class WishListServiceTest {
  constructor(private http: HttpClient) {}

  list(): Observable<WishList[]> {
    return Observable.of(mockList);
  }
}
