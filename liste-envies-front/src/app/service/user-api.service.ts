import { Injectable } from "@angular/core";
import {
  Body,
  GET,
  Path,
  PathParam,
  POST,
  PUT,
  DELETE
} from "ngx-http-annotations";
import { Observable } from "rxjs/Observable";
import { WishItem } from "../models/WishItem";
import { Notification } from "../state/app/notification.model";

@Injectable({
  providedIn: "root"
})
@Path("/api/utilisateur/")
export class UserAPIService {
  constructor() {}

  @GET
  @Path(":email/notifications")
  notifications(@PathParam("email") email: string): Observable<Notification[]> {
    return null;
  }

  @GET
  @Path(":email/given")
  given(@PathParam("email") email: string): Observable<WishItem[]> {
    return null;
  }

  @GET
  @Path(":email/archived")
  archived(@PathParam("email") email: string): Observable<WishItem[]> {
    return null;
  }

  @GET
  @Path("my")
  my(): Observable<any> {
    return null;
  }
}
