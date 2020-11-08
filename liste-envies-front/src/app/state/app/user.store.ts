import { Injectable } from "@angular/core";
import { Store, StoreConfig } from "@datorama/akita";
import { User, UserInfo } from "firebase";

export interface UserState {
  user: UserInfo;
  token: string;
}

export function createInitialState(): UserState {
  return {
    user: null,
    token: ""
  };
}

@Injectable({ providedIn: "root" })
@StoreConfig({ name: "user" })
export class UserStore extends Store<UserState> {
  constructor() {
    super(createInitialState());
  }
}
