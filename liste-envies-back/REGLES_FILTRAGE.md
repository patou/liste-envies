# Système de règles, filtrage et obfuscation

Ce document décrit le système de règles, filtrage et obfuscation implémenté dans la version Node.js/NestJS, portée depuis la version Java originale.

## Vue d'ensemble

Le système implémente trois composants principaux :

1. **Obfuscation** - Encodage Base64 des informations sensibles
2. **Règles de permissions** - Contrôle d'accès basé sur le rôle de l'utilisateur
3. **Filtrage des données** - Masquage des informations selon le contexte

## 1. Obfuscation (EncodeUtils)

### Fichier: `src/common/utils/encode.utils.ts`

Encode/décode en Base64 les informations sensibles des participants :

- Email
- Nom
- Photo
- Montant
- Message

**Utilisation :**

```typescript
// Encodage avant persistance
const encoded = EncodeUtils.encode('email@example.com');

// Décodage lors de la lecture
const decoded = EncodeUtils.decode(encodedString);
```

## 2. États et permissions

### WishListState (Enum)

Détermine le rôle de l'utilisateur par rapport à une liste :

- **OWNER** - Propriétaire de la liste

  - Peut tout voir et éditer
  - Ne peut PAS participer aux cadeaux

- **SHARED** - Utilisateur partagé (participant)

  - Peut voir les participants
  - Peut participer et suggérer

- **LOGGED** - Utilisateur connecté mais non membre

  - Visibilité selon privacy de la liste

- **ANONYMOUS** - Utilisateur non connecté

  - Accès limité aux listes PUBLIC uniquement

- **ARCHIVED** - État archivé
  - Mode lecture seule

### WishOptionType (Enum)

Contrôle la visibilité des participants :

- **NONE** - Aucune liste visible
- **HIDDEN** - Cache qui a participé (owner voit tout)
- **ANONYMOUS** - Remplace participants par "anonyme"
- **ALL** - Montre tout sauf suggestions
- **ALL_SUGGEST** - Montre absolument tout

### CommentType (Enum)

Contrôle la visibilité des commentaires :

- **PRIVATE** - Visible par participants (caché aux owners)
- **OWNER** - Visible par tous les participants incluant owners
- **PUBLIC** - Visible par tout le monde

## 3. Règles de permissions

### Fichier: `src/common/services/wish-rules.service.ts`

#### Méthodes principales

##### `canGive(wishList, userEmail, autoJoin)`

Vérifie si un utilisateur peut participer à une liste.

**Règles :**

- PRIVATE : Seuls les membres peuvent participer
- OPEN : Ajout automatique si autoJoin=true
- PUBLIC : Tout le monde peut participer
- Le propriétaire ne peut jamais participer

##### `canAddWish(wishList, userEmail, isSuggest)`

Vérifie si un utilisateur peut ajouter un souhait.

**Règles :**

- Propriétaire : Toujours autorisé
- PRIVATE : Seuls les membres
- OPEN/PUBLIC : Tout le monde

##### `canUpdateWish(wishList, wish, userEmail)`

Vérifie si un utilisateur peut modifier un souhait.

**Règles :**

- Créateur du souhait : Toujours autorisé
- Co-propriétaire : Peut modifier les souhaits des autres co-propriétaires

## 4. Filtrage des données

### Matrice de visibilité

| État      | Privacy | Participants | Suggestions  | Commentaires   |
| --------- | ------- | ------------ | ------------ | -------------- |
| OWNER     | PRIVATE | HIDDEN       | Non visibles | Filtré PRIVATE |
| OWNER     | OPEN    | ANONYMOUS    | Non visibles | Filtré PUBLIC  |
| OWNER     | PUBLIC  | ALL_SUGGEST  | Visibles     | Tous           |
| SHARED    | \*      | ALL_SUGGEST  | Visibles     | Tous           |
| LOGGED    | PRIVATE | NONE         | Non visibles | Aucun          |
| LOGGED    | OPEN    | ANONYMOUS    | Non visibles | PUBLIC         |
| LOGGED    | PUBLIC  | ALL_SUGGEST  | Visibles     | Tous           |
| ANONYMOUS | PRIVATE | NONE         | Non visibles | Aucun          |
| ANONYMOUS | OPEN    | NONE         | Non visibles | Aucun          |
| ANONYMOUS | PUBLIC  | ANONYMOUS    | Non visibles | PUBLIC         |

### Nettoyage des données

Le service `WishRulesService` applique automatiquement les règles suivantes :

**Pour les WishList :**

- État OWNER : Toutes les infos visibles
- État SHARED : Infos limitées
- État LOGGED (liste PRIVATE) : Users masqués
- État ANONYMOUS : Owners, users, description, date masqués

**Pour les Wishes :**

- Mode HIDDEN : userTake masqué, commentaires PRIVATE filtrés
- Mode ANONYMOUS : userTake remplacé par "anonyme", seuls commentaires PUBLIC
- Mode ALL/ALL_SUGGEST : Participants décodés et affichés

## 5. Intégration dans les services

### WishListService

```typescript
// Applique automatiquement les règles lors de la récupération
async getOrThrow(name: string, user?: any): Promise<WishListDto> {
  const entity = await this.get(name);
  const dto = this.mapToDto(entity);
  if (user) {
    return this.wishRulesService.applyRulesToWishList(user, dto);
  }
  return dto;
}
```

### WishesService

```typescript
// Encode les participants avant sauvegarde
const encodedUserTake = dto.userTake.map((p) =>
  this.wishRulesService.encodeParticipant(p),
);

// Décode et applique les règles lors de la lecture
const wishes = entities.map((e) => this.mapToDto(e));
return this.wishRulesService.applyRulesToWishes(user, wishList, wishes);
```

## 6. Utilisation dans les controllers

Les controllers passent simplement l'objet `user` complet aux services, qui appliquent automatiquement les règles :

```typescript
@Get(':name')
async getOneWishList(@Param('name') name: string, @User() user?: any) {
  // Les règles sont appliquées automatiquement
  return this.wishListService.getOrThrow(name, user);
}
```

## 7. Sécurité

### Données obfusquées en base

Les informations suivantes sont encodées en Base64 dans Datastore :

- Emails des participants
- Noms des participants
- Photos des participants
- Montants contribués
- Messages des participants

### Protection contre les accès non autorisés

- Vérification des permissions avant toute modification
- Filtrage automatique selon le rôle
- Masquage des informations sensibles pour les non-membres
- Mode anonyme pour protéger l'identité des participants

## 8. Tests recommandés

Pour valider l'iso-fonctionnalité avec la version Java, tester :

1. **Obfuscation**

   - Vérifier que les participants sont encodés en base
   - Vérifier le décodage lors de l'affichage

2. **Permissions**

   - OWNER ne peut pas participer
   - PRIVATE : seuls membres peuvent participer/ajouter
   - PUBLIC : tout le monde peut participer
   - Modification : seul créateur ou co-propriétaire

3. **Filtrage**

   - Mode HIDDEN : participants masqués pour non-owner
   - Mode ANONYMOUS : affichage "anonyme"
   - Commentaires PRIVATE invisibles pour owner
   - Suggestions visibles selon contexte

4. **États de liste**
   - Liste PRIVATE inaccessible aux non-membres
   - Liste PUBLIC accessible à tous
   - Liste OPEN avec auto-join
