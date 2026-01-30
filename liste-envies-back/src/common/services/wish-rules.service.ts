import { Injectable } from '@nestjs/common';
import {
  WishListDto,
  WishListState,
  WishOptionType,
  SharingPrivacyType,
  UserShareType,
  CommentType,
  WishListStatus,
} from '../../modules/wish-list/dto/wish-list.dto';
import {
  WishDto,
  PersonParticipantDto,
  CommentDto,
} from '../../modules/wishes/dto/wish.dto';
import { EncodeUtils } from '../utils/encode.utils';

/**
 * Service de règles pour l'application des filtres et permissions
 * Port de WishRules.java
 */
@Injectable()
export class WishRulesService {
  /**
   * Vérifie si un utilisateur peut participer à une liste
   */
  canGive(wishList: WishListDto, userEmail: string, autoJoin = true): boolean {
    if (!wishList || !userEmail || !wishList.privacy) {
      return false;
    }

    // Le propriétaire ne peut pas participer à sa propre liste
    if (this.containsOwner(wishList, userEmail)) {
      return false;
    }

    switch (wishList.privacy) {
      case SharingPrivacyType.PRIVATE:
        // En mode privé, seuls les utilisateurs de la liste peuvent participer
        return this.containsUser(wishList, userEmail);
      case SharingPrivacyType.OPEN:
        // En mode ouvert, l'utilisateur est ajouté automatiquement si nécessaire
        if (!this.containsUser(wishList, userEmail) && autoJoin) {
          // Note: L'ajout automatique doit être géré par le service appelant
        }
        return true;
      case SharingPrivacyType.PUBLIC:
        // En mode public, tout le monde peut participer
        return true;
      default:
        return false;
    }
  }

  /**
   * Vérifie si un utilisateur peut ajouter un souhait à une liste
   */
  canAddWish(
    wishList: WishListDto,
    userEmail: string,
    isSuggest = false,
  ): boolean {
    if (!wishList || !userEmail || !wishList.privacy) {
      return false;
    }

    // Le propriétaire peut toujours ajouter
    if (this.containsOwner(wishList, userEmail)) {
      return true;
    }

    switch (wishList.privacy) {
      case SharingPrivacyType.PRIVATE:
        // En mode privé, seuls les utilisateurs de la liste peuvent ajouter
        return this.containsUser(wishList, userEmail);
      case SharingPrivacyType.OPEN:
      case SharingPrivacyType.PUBLIC:
        // En mode ouvert ou public, tout le monde peut ajouter
        return true;
      default:
        return false;
    }
  }

  /**
   * Vérifie si un utilisateur peut modifier un souhait
   */
  canUpdateWish(
    wishList: WishListDto,
    wish: WishDto,
    userEmail: string,
  ): boolean {
    if (!wishList || !userEmail || !wish || !wish.owner) {
      return false;
    }

    // L'utilisateur peut modifier son propre souhait
    if (wish.owner.email === userEmail) {
      return true;
    }

    // Un propriétaire peut modifier un souhait créé par un co-propriétaire
    if (
      this.containsOwner(wishList, userEmail) &&
      this.containsOwner(wishList, wish.owner.email || '')
    ) {
      return true;
    }

    return false;
  }

  /**
   * Applique les règles sur une liste de souhaits
   */
  applyRulesToWishes(
    user: any,
    wishList: WishListDto | null,
    wishes: WishDto[],
  ): WishDto[] {
    const state = this.computeWishListState(user, wishList);
    const optionType = this.computeWishOptionsType(user, wishList);
    const filteredWishes = this.filterWishList(wishes, optionType);
    return this.computeWishPermissions(filteredWishes, user, wishList);
  }

  /**
   * Applique les règles sur un souhait unique
   */
  applyRulesToWish(
    user: any,
    wishList: WishListDto | null,
    wish: WishDto,
  ): WishDto {
    const optionType = this.computeWishOptionsType(user, wishList);
    const cleanedWish = this.cleanWish({ ...wish }, optionType);
    const state = this.computeWishListState(user, wishList);
    this.computeSingleWishPermissions(cleanedWish, user, wishList, state);
    return cleanedWish;
  }

  /**
   * Applique les règles sur une liste
   */
  applyRulesToWishList(user: any, wishList: WishListDto): WishListDto {
    const dto = { ...wishList };
    this.cleanWishList(wishList, dto, user);
    this.computeWishListPermissions(dto, wishList, user);
    return dto;
  }

  /**
   * Applique les règles sur plusieurs listes
   */
  applyRulesToWishLists(user: any, wishLists: WishListDto[]): WishListDto[] {
    return wishLists
      .filter((list) => list.status !== WishListStatus.ARCHIVED)
      .map((list) => {
        const dto = { ...list };
        this.cleanWishList(list, dto, user);
        return dto;
      });
  }

  /**
   * Détermine l'état de la liste pour l'utilisateur
   */
  private computeWishListState(
    user: any,
    list: WishListDto | null,
  ): WishListState {
    if (user && user.email) {
      if (list) {
        if (this.containsOwner(list, user.email)) {
          return WishListState.OWNER;
        } else if (this.containsUser(list, user.email)) {
          return WishListState.SHARED;
        }
      }
      return WishListState.LOGGED;
    }
    return WishListState.ANONYMOUS;
  }

  /**
   * Détermine le type d'options de visibilité
   */
  private computeWishOptionsType(
    user: any,
    list: WishListDto | null,
  ): WishOptionType {
    const state = this.computeWishListState(user, list);

    switch (state) {
      case WishListState.OWNER:
        if (list?.forceAnonymous) {
          return WishOptionType.ANONYMOUS;
        }
        if (list?.privacy) {
          switch (list.privacy) {
            case SharingPrivacyType.PRIVATE:
              return WishOptionType.HIDDEN;
            case SharingPrivacyType.OPEN:
              return WishOptionType.ANONYMOUS;
            case SharingPrivacyType.PUBLIC:
              return WishOptionType.ALL_SUGGEST;
          }
        }
        return WishOptionType.HIDDEN;

      case WishListState.SHARED:
        return WishOptionType.ALL_SUGGEST;

      case WishListState.LOGGED:
        if (list?.privacy) {
          switch (list.privacy) {
            case SharingPrivacyType.PRIVATE:
              return WishOptionType.NONE;
            case SharingPrivacyType.OPEN:
              return WishOptionType.ANONYMOUS;
            case SharingPrivacyType.PUBLIC:
              return WishOptionType.ALL_SUGGEST;
          }
        }
        return list ? WishOptionType.NONE : WishOptionType.ALL_SUGGEST;

      case WishListState.ANONYMOUS:
        if (list?.privacy) {
          switch (list.privacy) {
            case SharingPrivacyType.PRIVATE:
            case SharingPrivacyType.OPEN:
              return WishOptionType.NONE;
            case SharingPrivacyType.PUBLIC:
              return WishOptionType.ANONYMOUS;
          }
        }
        return WishOptionType.NONE;

      default:
        return WishOptionType.ALL_SUGGEST;
    }
  }

  /**
   * Filtre la liste de souhaits selon le type d'options
   */
  private filterWishList(wishes: WishDto[], type: WishOptionType): WishDto[] {
    if (type === WishOptionType.NONE) {
      return [];
    }

    let filtered = wishes;

    // Filtrer les suggestions si nécessaire
    if (type !== WishOptionType.ALL_SUGGEST) {
      filtered = filtered.filter((wish) => wish.suggest !== true);
    }

    // Nettoyer chaque souhait
    return filtered.map((wish) => this.cleanWish({ ...wish }, type));
  }

  /**
   * Nettoie un souhait selon le type d'options
   */
  private cleanWish(wish: WishDto, type: WishOptionType): WishDto {
    switch (type) {
      case WishOptionType.HIDDEN:
        wish.userTake = undefined;
        wish.given = wish.allreadyGiven || false;
        // Filtrer les commentaires privés
        if (wish.comments && wish.comments.length > 0) {
          wish.comments = wish.comments.filter(
            (c) => c.type !== CommentType.PRIVATE,
          );
        }
        break;

      case WishOptionType.ANONYMOUS:
        if (!wish.userTake || wish.userTake.length === 0) {
          wish.userTake = undefined;
          wish.given = wish.allreadyGiven || false;
        } else {
          // Remplacer par un participant anonyme
          const anonymous: PersonParticipantDto = {
            email: '',
            name: 'anonyme',
            picture: '',
            amount: '',
            message: '',
          };
          wish.userTake = [anonymous];
          wish.given = true;
          wish.userGiven = true;
        }
        // Filtrer pour ne garder que les commentaires publics
        if (wish.comments && wish.comments.length > 0) {
          wish.comments = wish.comments.filter(
            (c) => c.type === CommentType.PUBLIC,
          );
        }
        break;

      case WishOptionType.ALL:
      case WishOptionType.ALL_SUGGEST:
        // Décoder les informations des participants
        if (wish.userTake && wish.userTake.length > 0) {
          wish.userTake = wish.userTake.map((p) => this.decodeParticipant(p));
          wish.given = true;
        } else {
          wish.given = wish.allreadyGiven || false;
        }
        break;
    }

    return wish;
  }

  /**
   * Nettoie les informations de la liste selon les permissions
   */
  private cleanWishList(list: WishListDto, dto: WishListDto, user: any): void {
    const state = this.computeWishListState(user, list);
    dto.state = state;

    if (state === WishListState.OWNER) {
      dto.isOwner = true;
      return;
    }

    if (state === WishListState.SHARED) {
      return;
    }

    if (state === WishListState.LOGGED) {
      // Seules les informations des listes privées ne sont pas gardées
      if (list.privacy !== SharingPrivacyType.PRIVATE) {
        return;
      }
      // Continue vers le nettoyage ANONYMOUS
    }

    // État ANONYMOUS ou LOGGED avec liste PRIVATE
    dto.users = undefined;
    if (list.privacy === SharingPrivacyType.PUBLIC) {
      // Si liste publique, toutes les informations sont publiques
      return;
    }

    // Par défaut, toutes les informations personnelles sont nettoyées
    dto.owners = undefined;
    dto.users = undefined;
    dto.description = undefined;
    dto.date = undefined;
  }

  /**
   * Calcule les permissions pour une liste de souhaits
   */
  private computeWishPermissions(
    wishes: WishDto[],
    user: any,
    wishList: WishListDto | null,
  ): WishDto[] {
    const state = this.computeWishListState(user, wishList);
    wishes.forEach((wish) =>
      this.computeSingleWishPermissions(wish, user, wishList, state),
    );
    return wishes;
  }

  /**
   * Calcule les permissions pour un souhait unique
   */
  private computeSingleWishPermissions(
    wish: WishDto,
    user: any,
    wishList: WishListDto | null,
    state: WishListState,
  ): void {
    switch (state) {
      case WishListState.OWNER:
        wish.canEdit = true;
        wish.canParticipate = false;
        wish.canSuggest = false;
        break;

      case WishListState.SHARED:
        if (wish.owner) {
          wish.canEdit = wish.owner.email === user?.email;
        } else {
          wish.canEdit = false;
        }
        wish.canParticipate = true;
        wish.canSuggest = true;
        break;

      case WishListState.ARCHIVED:
        wish.canEdit = false;
        wish.canParticipate = false;
        wish.canSuggest = false;
        break;

      case WishListState.LOGGED:
      case WishListState.ANONYMOUS:
        wish.canEdit = false;
        wish.canParticipate = true;
        wish.canSuggest = false;
        break;
    }

    if (wish.allreadyGiven) {
      wish.canParticipate = false;
      wish.given = true;
    }

    wish.userGiven = false;
    if (wish.userTake && user?.email) {
      for (const person of wish.userTake) {
        if (person.email === user.email) {
          wish.userGiven = true;
          break;
        }
      }
    }
  }

  /**
   * Calcule les permissions pour une liste
   */
  private computeWishListPermissions(
    dto: WishListDto,
    wishList: WishListDto,
    user: any,
  ): void {
    const state = this.computeWishListState(user, wishList);
    switch (state) {
      case WishListState.OWNER:
        dto.canSuggest = false;
        dto.isOwner = true;
        break;
      case WishListState.SHARED:
      case WishListState.LOGGED:
        dto.canSuggest = true;
        dto.isOwner = false;
        break;
      default:
        dto.canSuggest = false;
        dto.isOwner = false;
        break;
    }
  }

  /**
   * Vérifie si la liste contient un propriétaire spécifique
   */
  private containsOwner(wishList: WishListDto, email: string): boolean {
    return (
      wishList.users?.some(
        (u) => u.email === email && u.type === UserShareType.OWNER,
      ) || false
    );
  }

  /**
   * Vérifie si la liste contient un utilisateur spécifique
   */
  private containsUser(wishList: WishListDto, email: string): boolean {
    return wishList.users?.some((u) => u.email === email) || false;
  }

  /**
   * Encode un participant (pour la persistance)
   */
  encodeParticipant(participant: PersonParticipantDto): PersonParticipantDto {
    return {
      email: EncodeUtils.encode(participant.email) || '',
      name: EncodeUtils.encode(participant.name) || '',
      picture: EncodeUtils.encode(participant.picture) || '',
      amount: EncodeUtils.encode(participant.amount) || '',
      message: EncodeUtils.encode(participant.message) || '',
    };
  }

  /**
   * Décode un participant (pour l'affichage)
   */
  decodeParticipant(participant: PersonParticipantDto): PersonParticipantDto {
    return {
      email: EncodeUtils.decode(participant.email) || '',
      name: EncodeUtils.decode(participant.name) || '',
      picture: EncodeUtils.decode(participant.picture) || '',
      amount: EncodeUtils.decode(participant.amount) || '',
      message: EncodeUtils.decode(participant.message) || '',
    };
  }
}
