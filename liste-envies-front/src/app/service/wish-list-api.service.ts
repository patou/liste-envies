import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { WishComment, WishItem } from "../models/WishItem";
import { WishList } from "../models/WishList";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import {
  Body,
  GET,
  Path,
  PathParam,
  POST,
  PUT,
  DELETE
} from "ngx-http-annotations";

@Injectable()
@Path("/api/")
export class WishListApiService {
  constructor(private http: HttpClient) {}

  @GET
  @Path("list/")
  listAll(): Observable<WishList[]> {
    return null;
  }

  @POST
  @Path("list/:name")
  createOrUpdateList(
    @PathParam("name") name: string,
    @Body wishList: WishList
  ): Observable<WishList> {
    return null;
  }

  @GET
  @Path("list/:name")
  wishList(@PathParam("name") name: string): Observable<WishList> {
    return null;
  }

  @GET
  @Path("wishes/:name")
  wishes(@PathParam("name") name: string): Observable<WishItem[]> {
    return null;
  }

  @POST
  @Path("wishes/:name")
  createWish(
    @PathParam("name") name: string,
    @Body wish: WishItem
  ): Observable<WishItem> {
    return null;
  }

  @POST
  @Path("wishes/:name/:id")
  updateWish(
    @PathParam("name") name: string,
    @PathParam("id") id: number,
    @Body wish: WishItem
  ): Observable<WishItem> {
    return null;
  }

  @PUT
  @Path("wishes/:name/give/:id")
  give(
    @PathParam("name") name: string,
    @PathParam("id") id: number
  ): Observable<WishItem> {
    return null;
  }

  @PUT
  @Path("wishes/:name/archive/:id")
  archive(
    @PathParam("name") name: string,
    @PathParam("id") id: number
  ): Observable<WishItem> {
    return null;
  }

  @DELETE
  @Path("wishes/:name/:id")
  delete(
    @PathParam("name") name: string,
    @PathParam("id") id: number
  ): Observable<WishItem> {
    return null;
  }

  @POST
  @Path("wishes/:name/:id/addComment")
  comment(
    @PathParam("name") listId: string,
    @PathParam("id") id: number,
    @Body note: Partial<WishComment>
  ): Observable<WishItem> {
    return null;
  }
}
