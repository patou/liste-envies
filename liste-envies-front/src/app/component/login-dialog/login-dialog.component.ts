import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FirebaseUISignInSuccess } from "../../shared/firebaseui";

@Component({
  selector: "app-login-dialog",
  templateUrl: "./login-dialog.component.html",
  styleUrls: ["./login-dialog.component.scss"]
})
export class LoginDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<LoginDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {}

  successCallback(signInSuccessData: FirebaseUISignInSuccess) {
    this.dialogRef.close(signInSuccessData);
  }
}
