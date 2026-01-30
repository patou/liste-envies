# Guide rapide : Résoudre l'erreur 401 Unauthorized

## Le Problème

Vous recevez cette erreur lors de la création d'une liste :

```json
{ "message": "Invalid token", "error": "Unauthorized", "statusCode": 401 }
```

## La Cause

Le backend NestJS ne peut pas vérifier les tokens JWT Firebase car Firebase Admin SDK n'est pas correctement configuré avec les credentials.

## La Solution Rapide

### Étape 1 : Télécharger la clé de service Firebase

1. Allez sur https://console.firebase.google.com/
2. Sélectionnez votre projet "test-liste-envies"
3. Cliquez sur ⚙️ (Settings) → "Project settings"
4. Allez dans l'onglet "Service accounts"
5. Cliquez sur "Generate new private key"
6. Téléchargez le fichier JSON

### Étape 2 : Configurer les credentials

**Option A : Fichier JSON (Plus simple)**

Copiez le fichier JSON téléchargé dans :

```
c:\Users\A740550\IdeaProjects\liste-envies\liste-envies-back\firebase-service-account.json
```

**Option B : Variables d'environnement**

Ouvrez le fichier `.env` à la racine du projet et remplacez ces lignes :

```env
FIREBASE_CLIENT_EMAIL=your-service-account@test-liste-envies.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
```

Par les vraies valeurs du fichier JSON téléchargé :

- Copiez `client_email` → `FIREBASE_CLIENT_EMAIL`
- Copiez `private_key` → `FIREBASE_PRIVATE_KEY` (gardez les guillemets et les \n)

### Étape 3 : Redémarrer le backend

1. Arrêtez le serveur backend (Ctrl+C)
2. Relancez-le avec : `npm run start:dev`

### Étape 4 : Tester

Essayez de créer une nouvelle liste. L'erreur 401 devrait avoir disparu !

## Sécurité

⚠️ **Important** : Le fichier `firebase-service-account.json` et le fichier `.env` sont déjà dans `.gitignore`. Ne les partagez jamais et ne les commitez jamais dans Git !

## Besoin d'aide ?

Consultez [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) pour plus de détails.
