import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { createInitialState, UserStore } from "./user.store";
import { User } from "firebase";

@Injectable({ providedIn: "root" })
export class UserService {
  constructor(private userStore: UserStore, private http: HttpClient) {}

  login(user: Partial<User>, token) {
    return this.userStore.update({ user, token });
  }

  logout() {
    this.userStore.update(createInitialState());
  }

  isPristine() : boolean {
    return this.userStore.isPristine;
  }
}
