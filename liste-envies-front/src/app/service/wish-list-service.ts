import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {WishItem} from '../models/WishItem';
import {WishList} from '../models/WishList';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {AuthService} from './auth.service';
import {Path, GET, PathParam} from 'ngx-http-annotations';

@Injectable()
@Path('/api/')
export class WishListService {
  private _list$: BehaviorSubject<WishList[]>;

  constructor(private http: HttpClient, private auth: AuthService) {

    this._list$ = new BehaviorSubject<WishList[]>([]);
    this.listAll().subscribe(list => this._list$.next(list));

    // Recharger la liste des envies en fonction dès qu'il y a un changement d'utilisateur
    this.auth.user.subscribe(value => {
      this.listAll().subscribe(list => {
        console.log('## new list ', value);
        this._list$.next(list);
      });
      console.log('# Change user in wish List  / ', value);
    });
  }

  get list(): Observable<WishList[]> {
    return this._list$.asObservable();
  }

  @GET
  @Path('list/')
  listAll(): Observable<WishList[]> {
    return null;
  }

  @GET
  @Path('list/;name')
  wishList(@PathParam('name') name: string): Observable<WishList> {
    return null;
  }

  @GET
  @Path('wishes/;name')
  wishes(@PathParam('name') name: string): Observable<WishItem[]> {
    return null;
  }
}
