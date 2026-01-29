import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../service/auth.service";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { UserState } from "../../state/app/user.store";
import { UserQuery } from "../../state/app/user.query";
import { Router } from "@angular/router";
import { LoginPopUpService } from "../../service/login-pop-up.service";
import {
  Auth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup
} from "@angular/fire/auth";

@UntilDestroy()
@Component({
  selector: "app-connect",
  templateUrl: "./connect.component.html",
  styleUrls: ["./connect.component.scss"],
  standalone: false
})
export class ConnectComponent implements OnInit {
  constructor(
    private auth: AuthService,
    private fireAuth: Auth,
    private user: UserQuery,
    private router: Router,
    private loginPopUp: LoginPopUpService
  ) {}

  ngOnInit() {
    this.user
      .select()
      .pipe(untilDestroyed(this))
      .subscribe((userInfo: UserState) => {
        if (userInfo.user) {
          this.router.navigateByUrl("/");
        }
      });
  }

  async signInWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(this.fireAuth, provider);
    } catch (error) {
      console.error("Erreur lors de la connexion avec Google:", error);
    }
  }

  async signInWithFacebook() {
    try {
      const provider = new FacebookAuthProvider();
      await signInWithPopup(this.fireAuth, provider);
    } catch (error) {
      console.error("Erreur lors de la connexion avec Facebook:", error);
    }
  }

  connect() {
    this.loginPopUp.openLoginPopUp().subscribe(result => {});
  }
}
