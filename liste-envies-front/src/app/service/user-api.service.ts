import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { WishItem } from "../models/WishItem";
import { Notification } from "../state/app/notification.model";

@Injectable({
  providedIn: "root"
})
export class UserAPIService {
  private readonly basePath = "/api/utilisateur";

  constructor(private http: HttpClient) {}

  notifications(email: string): Observable<Notification[]> {
    return this.http.get<Notification[]>(
      `${this.basePath}/${email}/notifications`
    );
  }

  given(email: string): Observable<WishItem[]> {
    return this.http.get<WishItem[]>(`${this.basePath}/${email}/given`);
  }

  archived(email: string): Observable<WishItem[]> {
    return this.http.get<WishItem[]>(`${this.basePath}/${email}/archived`);
  }

  my(): Observable<any> {
    return this.http.get<any>(`${this.basePath}/my`);
  }
}
