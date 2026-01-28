import { Injectable } from "@angular/core";
import { FirebaseError } from "@angular/fire/app";

export interface AuthErrorMessage {
  field: "email" | "password" | "general" | "name";
  message: string;
}

@Injectable({
  providedIn: "root"
})
export class FirebaseAuthErrorService {
  constructor() {}

  /**
   * Traduit les codes d'erreur Firebase Auth en messages français compréhensibles
   * et identifie le champ concerné pour afficher l'erreur au bon endroit
   * @param error L'erreur Firebase retournée
   * @returns Objet contenant le champ concerné et le message traduit
   */
  getErrorMessage(error: any): AuthErrorMessage {
    const code = error?.code || "";

    // Erreurs liées à l'email
    if (code === "auth/email-already-in-use") {
      return {
        field: "email",
        message: "Cette adresse email est déjà utilisée"
      };
    }

    if (code === "auth/invalid-email") {
      return {
        field: "email",
        message: "Adresse email invalide"
      };
    }

    if (code === "auth/user-not-found") {
      return {
        field: "email",
        message: "Aucun compte ne correspond à cet email"
      };
    }

    // Erreurs liées au mot de passe
    if (code === "auth/weak-password") {
      return {
        field: "password",
        message: "Le mot de passe doit contenir au moins 6 caractères"
      };
    }

    if (code === "auth/wrong-password") {
      return {
        field: "password",
        message: "Mot de passe incorrect"
      };
    }

    // Erreurs générales
    if (code === "auth/too-many-requests") {
      return {
        field: "general",
        message: "Trop de tentatives. Réessayez plus tard"
      };
    }

    if (code === "auth/network-request-failed") {
      return {
        field: "general",
        message: "Erreur de connexion. Vérifiez votre connexion internet"
      };
    }

    if (code === "auth/user-disabled") {
      return {
        field: "general",
        message: "Ce compte a été désactivé"
      };
    }

    if (code === "auth/operation-not-allowed") {
      return {
        field: "general",
        message: "Cette opération n'est pas autorisée"
      };
    }

    if (code === "auth/invalid-credential") {
      return {
        field: "general",
        message: "Identifiants invalides"
      };
    }

    // Erreur par défaut
    return {
      field: "general",
      message:
        error?.message || "Une erreur est survenue lors de l'authentification"
    };
  }
}
