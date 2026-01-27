import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { WishComment, WishItem } from "../models/WishItem";
import { WishList } from "../models/WishList";

@Injectable()
export class WishListApiService {
  private readonly basePath = "/api";

  constructor(private http: HttpClient) {}

  listAll(): Observable<WishList[]> {
    return this.http.get<WishList[]>(`${this.basePath}/list/`);
  }

  createOrUpdateList(name: string, wishList: WishList): Observable<WishList> {
    return this.http.post<WishList>(`${this.basePath}/list/${name}`, wishList);
  }

  wishList(name: string): Observable<WishList> {
    return this.http.get<WishList>(`${this.basePath}/list/${name}`);
  }

  archiveWishList(name: string): Observable<WishList> {
    return this.http.put<WishList>(
      `${this.basePath}/list/${name}/archive`,
      null
    );
  }

  wishes(name: string): Observable<WishItem[]> {
    return this.http.get<WishItem[]>(`${this.basePath}/wishes/${name}`);
  }

  wishesArchived(name: string): Observable<WishItem[]> {
    return this.http.get<WishItem[]>(
      `${this.basePath}/wishes/${name}/archived`
    );
  }

  wishesReceived(): Observable<WishItem[]> {
    return this.http.get<WishItem[]>(`${this.basePath}/wishes/received`);
  }

  createWish(name: string, wish: WishItem): Observable<WishItem> {
    return this.http.post<WishItem>(`${this.basePath}/wishes/${name}`, wish);
  }

  updateWish(name: string, id: number, wish: WishItem): Observable<WishItem> {
    return this.http.post<WishItem>(
      `${this.basePath}/wishes/${name}/${id}`,
      wish
    );
  }

  give(name: string, id: number): Observable<WishItem> {
    return this.http.put<WishItem>(
      `${this.basePath}/wishes/${name}/give/${id}`,
      null
    );
  }

  cancelGive(name: string, id: number): Observable<WishItem> {
    return this.http.delete<WishItem>(
      `${this.basePath}/wishes/${name}/give/${id}`
    );
  }

  archive(name: string, id: number): Observable<WishItem> {
    return this.http.put<WishItem>(
      `${this.basePath}/wishes/${name}/archive/${id}`,
      null
    );
  }

  delete(name: string, id: number): Observable<WishItem> {
    return this.http.delete<WishItem>(`${this.basePath}/wishes/${name}/${id}`);
  }

  comment(
    listId: string,
    id: number,
    note: Partial<WishComment>
  ): Observable<WishItem> {
    return this.http.post<WishItem>(
      `${this.basePath}/wishes/${listId}/${id}/addComment`,
      note
    );
  }
}
