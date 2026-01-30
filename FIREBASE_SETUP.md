# Configuration Firebase Admin SDK

## Problème

L'erreur `{"message":"Invalid token","error":"Unauthorized","statusCode":401}` survient car le backend NestJS ne peut pas vérifier les tokens JWT Firebase sans les credentials d'administration.

## Solution

Pour que le backend puisse vérifier les tokens d'authentification, vous devez configurer Firebase Admin SDK avec une clé de service account.

### Étapes pour obtenir les credentials :

1. **Allez sur Firebase Console**

   - Ouvrez [Firebase Console](https://console.firebase.google.com/)
   - Sélectionnez votre projet : **test-liste-envies**

2. **Accédez aux Service Accounts**

   - Cliquez sur l'icône ⚙️ (Settings) en haut à gauche
   - Sélectionnez **"Project settings"**
   - Allez dans l'onglet **"Service accounts"**

3. **Générez une nouvelle clé privée**

   - Cliquez sur **"Generate new private key"**
   - Confirmez en cliquant sur **"Generate key"**
   - Un fichier JSON sera téléchargé automatiquement

4. **Extraire les informations nécessaires**

   Ouvrez le fichier JSON téléchargé. Il ressemble à ceci :

   ```json
   {
     "type": "service_account",
     "project_id": "test-liste-envies",
     "private_key_id": "...",
     "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
     "client_email": "firebase-adminsdk-xxxxx@test-liste-envies.iam.gserviceaccount.com",
     "client_id": "...",
     "auth_uri": "...",
     "token_uri": "...",
     "auth_provider_x509_cert_url": "...",
     "client_x509_cert_url": "..."
   }
   ```

5. **Mettre à jour le fichier `.env`**

   Dans le fichier `.env` à la racine du projet (c:\Users\A740550\IdeaProjects\liste-envies\.env), remplacez :

   ```env
   FIREBASE_CLIENT_EMAIL=your-service-account@test-liste-envies.iam.gserviceaccount.com
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
   ```

   Par les vraies valeurs extraites du fichier JSON :

   - `FIREBASE_CLIENT_EMAIL` : la valeur de `client_email`
   - `FIREBASE_PRIVATE_KEY` : la valeur de `private_key` (gardez les guillemets et les \n)

6. **Redémarrez le backend**

   Une fois le fichier `.env` mis à jour, redémarrez le serveur backend pour que les changements prennent effet.

## Sécurité

⚠️ **IMPORTANT** :

- Ne partagez jamais ce fichier JSON ou ces credentials
- Assurez-vous que `.env` est bien dans le `.gitignore`
- Ne commitez jamais les credentials dans Git

## Alternative : Utiliser le fichier JSON directement

Si vous préférez, vous pouvez aussi placer le fichier JSON téléchargé dans le dossier du backend et modifier le code pour l'utiliser directement. Contactez-moi si vous souhaitez cette approche.
