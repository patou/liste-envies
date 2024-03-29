import { Injectable } from "@angular/core";
import {
  action,
  ActiveState,
  EntityState,
  EntityStore,
  StoreConfig
} from "@datorama/akita";
import { WishList } from "../../models/WishList";
import { WishItem } from "../../models/WishItem";
import { state } from "@angular/animations";
import * as _ from "lodash";

export interface WishState extends EntityState<WishItem>, ActiveState {
  wishList: WishList;
  ui: {
    loaded: {
      full: boolean;
      toOffer: boolean;
      archive: boolean;
    };
  };
}

@Injectable({ providedIn: "root" })
@StoreConfig({ name: "wish" })
export class WishStore extends EntityStore<WishState> {
  constructor() {
    super({
      wishList: null,
      ui: {
        loaded: { full: false, toOffer: false, archive: false }
      }
    });
  }

  @action("set to reload")
  setReload() {
    this.update(state => {
      state = _.merge({}, state, {
        ui: { loaded: { full: false, toOffer: false, archive: false } }
      });
      return state;
    });
  }

  @action("loaded toOffer")
  setLoadedToFull(isFull: boolean) {
    this.update(state => {
      state = _.merge({}, state, {
        ui: { loaded: { full: isFull } }
      });
      return state;
    });
  }

  @action("loaded toOffer")
  setLoadedToOffer() {
    this.update(state => {
      state = _.merge({}, state, {
        ui: { loaded: { toOffer: true } }
      });
      return state;
    });
  }
  @action("loaded archive")
  setLoadedArchive() {
    this.update(state => {
      state = _.merge({}, state, {
        ui: { loaded: { archive: true } }
      });
      return state;
    });
  }
}
