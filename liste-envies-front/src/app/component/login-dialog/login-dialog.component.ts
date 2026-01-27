import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import {
  Auth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup
} from "@angular/fire/auth";

@Component({
  selector: "app-login-dialog",
  templateUrl: "./login-dialog.component.html",
  styleUrls: ["./login-dialog.component.scss"]
})
export class LoginDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<LoginDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message?: string },
    private auth: Auth
  ) {}

  ngOnInit() {}

  async signInWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(this.auth, provider);
      this.successCallback(result.user);
    } catch (error) {
      console.error("Erreur lors de la connexion avec Google:", error);
    }
  }

  async signInWithFacebook() {
    try {
      const provider = new FacebookAuthProvider();
      const result = await signInWithPopup(this.auth, provider);
      this.successCallback(result.user);
    } catch (error) {
      console.error("Erreur lors de la connexion avec Facebook:", error);
    }
  }

  successCallback(signInSuccessData) {
    this.dialogRef.close(signInSuccessData);
  }
}
