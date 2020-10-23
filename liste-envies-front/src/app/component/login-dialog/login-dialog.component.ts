import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { AUTH_PROVIDERS } from "../../shared/auth_providers";
import { AuthProvider } from "ngx-auth-firebaseui";

@Component({
  selector: "app-login-dialog",
  templateUrl: "./login-dialog.component.html",
  styleUrls: ["./login-dialog.component.scss"]
})
export class LoginDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<LoginDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(AUTH_PROVIDERS) public providers: AuthProvider[]
  ) {}

  ngOnInit() {}

  successCallback(signInSuccessData) {
    this.dialogRef.close(signInSuccessData);
  }
}
