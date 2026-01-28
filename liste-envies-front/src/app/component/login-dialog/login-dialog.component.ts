import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import {
  Auth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile
} from "@angular/fire/auth";
import { FirebaseAuthErrorService } from "../../service/firebase-auth-error.service";

@Component({
  selector: "app-login-dialog",
  templateUrl: "./login-dialog.component.html",
  styleUrls: ["./login-dialog.component.scss"]
})
export class LoginDialogComponent implements OnInit {
  loginForm: FormGroup;
  registerForm: FormGroup;
  isResetMode = false;
  isLoading = false;
  hidePassword = true;
  hideRegisterPassword = true;

  // Erreurs pour chaque champ
  emailError: string | null = null;
  passwordError: string | null = null;
  nameError: string | null = null;
  generalError: string | null = null;

  constructor(
    public dialogRef: MatDialogRef<LoginDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message?: string },
    private auth: Auth,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private firebaseAuthErrorService: FirebaseAuthErrorService
  ) {
    // Formulaire de connexion
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]]
    });

    // Formulaire d'inscription
    this.registerForm = this.fb.group({
      name: [
        "",
        [Validators.required, Validators.minLength(2), Validators.maxLength(50)]
      ],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
    // Effacer les erreurs quand l'utilisateur modifie les champs
    this.loginForm.get("email")?.valueChanges.subscribe(() => {
      this.emailError = null;
      this.generalError = null;
    });

    this.loginForm.get("password")?.valueChanges.subscribe(() => {
      this.passwordError = null;
      this.generalError = null;
    });

    this.registerForm.get("email")?.valueChanges.subscribe(() => {
      this.emailError = null;
      this.generalError = null;
    });

    this.registerForm.get("password")?.valueChanges.subscribe(() => {
      this.passwordError = null;
      this.generalError = null;
    });

    this.registerForm.get("name")?.valueChanges.subscribe(() => {
      this.nameError = null;
      this.generalError = null;
    });
  }

  async signInWithGoogle() {
    try {
      this.isLoading = true;
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(this.auth, provider);
      this.successCallback(result.user);
    } catch (error) {
      console.error("Erreur lors de la connexion avec Google:", error);
      const errorMessage = this.firebaseAuthErrorService.getErrorMessage(error);
      this.showSnackBar(errorMessage.message);
    } finally {
      this.isLoading = false;
    }
  }

  async signInWithFacebook() {
    try {
      this.isLoading = true;
      const provider = new FacebookAuthProvider();
      const result = await signInWithPopup(this.auth, provider);
      this.successCallback(result.user);
    } catch (error) {
      console.error("Erreur lors de la connexion avec Facebook:", error);
      const errorMessage = this.firebaseAuthErrorService.getErrorMessage(error);
      this.showSnackBar(errorMessage.message);
    } finally {
      this.isLoading = false;
    }
  }

  async onLogin() {
    if (this.loginForm.invalid) {
      return;
    }

    this.clearErrors();
    this.isLoading = true;

    try {
      const { email, password } = this.loginForm.value;
      const result = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      this.successCallback(result.user);
    } catch (error) {
      const errorMessage = this.firebaseAuthErrorService.getErrorMessage(error);
      if (errorMessage.field === "email") {
        this.emailError = errorMessage.message;
      } else if (errorMessage.field === "password") {
        this.passwordError = errorMessage.message;
      } else {
        this.generalError = errorMessage.message;
        this.showSnackBar(errorMessage.message);
      }
    } finally {
      this.isLoading = false;
    }
  }

  async onRegister() {
    if (this.registerForm.invalid) {
      return;
    }

    this.clearErrors();
    this.isLoading = true;

    try {
      const { name, email, password } = this.registerForm.value;
      const result = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );

      // Mettre à jour le nom d'affichage
      if (result.user) {
        await updateProfile(result.user, { displayName: name });
      }

      this.showSnackBar("Compte créé avec succès !");
      this.successCallback(result.user);
    } catch (error) {
      const errorMessage = this.firebaseAuthErrorService.getErrorMessage(error);
      if (errorMessage.field === "email") {
        this.emailError = errorMessage.message;
      } else if (errorMessage.field === "password") {
        this.passwordError = errorMessage.message;
      } else if (errorMessage.field === "name") {
        this.nameError = errorMessage.message;
      } else {
        this.generalError = errorMessage.message;
        this.showSnackBar(errorMessage.message);
      }
    } finally {
      this.isLoading = false;
    }
  }

  async onResetPassword() {
    const email = this.loginForm.get("email")?.value;

    if (!email) {
      this.emailError =
        "Un email est requis pour réinitialiser le mot de passe !";
      return;
    }

    if (!this.loginForm.get("email")?.valid) {
      this.emailError = "S'il vous plaît, mettez une adresse email valide";
      return;
    }

    this.clearErrors();
    this.isLoading = true;

    try {
      await sendPasswordResetEmail(this.auth, email);
      this.showSnackBar(
        "Un email vous a été envoyé pour réinitialiser votre mot de passe"
      );
      this.isResetMode = false;
    } catch (error) {
      const errorMessage = this.firebaseAuthErrorService.getErrorMessage(error);
      if (errorMessage.field === "email") {
        this.emailError = errorMessage.message;
      } else {
        this.showSnackBar(errorMessage.message);
      }
    } finally {
      this.isLoading = false;
    }
  }

  switchToResetMode() {
    this.isResetMode = true;
    this.clearErrors();
  }

  switchToLoginMode() {
    this.isResetMode = false;
    this.clearErrors();
  }

  onTabChange() {
    this.clearErrors();
    this.loginForm.reset();
    this.registerForm.reset();
  }

  private clearErrors() {
    this.emailError = null;
    this.passwordError = null;
    this.nameError = null;
    this.generalError = null;
  }

  private showSnackBar(message: string) {
    this.snackBar.open(message, "Fermer", {
      duration: 5000,
      horizontalPosition: "center",
      verticalPosition: "bottom"
    });
  }

  successCallback(signInSuccessData) {
    this.dialogRef.close(signInSuccessData);
  }
}
