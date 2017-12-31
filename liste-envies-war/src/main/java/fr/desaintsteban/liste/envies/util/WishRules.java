package fr.desaintsteban.liste.envies.util;

import fr.desaintsteban.liste.envies.dto.PersonParticipantDto;
import fr.desaintsteban.liste.envies.dto.UserShareDto;
import fr.desaintsteban.liste.envies.dto.WishDto;
import fr.desaintsteban.liste.envies.dto.WishListDto;
import fr.desaintsteban.liste.envies.enums.*;
import fr.desaintsteban.liste.envies.model.AppUser;
import fr.desaintsteban.liste.envies.model.UserShare;
import fr.desaintsteban.liste.envies.model.Wish;
import fr.desaintsteban.liste.envies.model.WishList;
import fr.desaintsteban.liste.envies.service.AppUserService;
import fr.desaintsteban.liste.envies.service.WishListService;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Predicate;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static fr.desaintsteban.liste.envies.util.StringUtils.isNullOrEmpty;
import static java.util.stream.Collectors.toList;
import static java.util.stream.Collectors.toSet;

/**
 * This class is for save all list
 */
public class WishRules {

    public static boolean canGive(WishList wishList, AppUser user) {
        if (wishList != null && user != null && wishList.getPrivacy() != null && !wishList.containsOwner(user.getEmail())) {
            switch (wishList.getPrivacy()) {
                case PRIVATE:
                    // En mode privé, on ne peut participer que si l'on fait partis de la liste
                    return wishList.containsUser(user.getEmail());
                case OPEN:
                    //Si on est pas dans la liste des utilisateurs on est automatiquement ajouté
                    if (!wishList.containsUser(user.getEmail())) {
                        WishListService.addUser(user, wishList);
                    }
                case PUBLIC:
                    //En mode ouvert ou public on peut participer à un cadeau.
                    return true;
            }
        }
        return false;
    }

    public static List<WishDto> applyRules(AppUser user, WishList wishList, List<Wish> wishes) {
        WishOptionType type = computeWishOptionsType(user, wishList);
        List<WishDto> wishDtos = computePermissions(filterWishList(wishes.stream().map(Wish::toDto).collect(toList()), type), user, wishList);
        if (wishList == null) {
            fillListTitle(wishDtos);
        }
        return wishDtos;
    }

    public static WishDto applyRules(AppUser user, WishList wishList, Wish wish) {
        WishOptionType type = computeWishOptionsType(user, wishList);
        WishDto wishDto = cleanWish(wish.toDto(), type);
        computePermissions(wishDto, user, wishList, computeWishListState(user, wishList));
        return wishDto;
    }

    public static WishListDto applyRules(AppUser user, WishList wishList) {
        Map<String,AppUser> map = null;
        if (wishList.getUsers() != null) {
            List<String> emails = wishList.getUsers().stream().map(UserShare::getEmail).collect(toList());
            map = AppUserService.loadAll(emails);
        }
        WishListDto dto = wishList.toDto();
        fillUsersInWishList(dto, wishList, user, map, true);
        cleanWishList(wishList, dto, user);
        return dto;
    }

    public static List<WishListDto> applyRules(AppUser user, List<WishList> wishList) {
        Set<String> emails = wishList.stream()
                .flatMap(list -> list.getUsers().stream())
                .filter(userShare -> userShare.getType() == UserShareType.OWNER)
                .map(UserShare::getEmail).collect(toSet());
        final Map<String,AppUser> map = AppUserService.loadAll(emails);
        return wishList.stream()
                .map(list -> {
                    WishListDto dto = list.toDto();
                    fillUsersInWishList(dto, list, user, map, false);
                    cleanWishList(list, dto, user);
                    return dto;
                })
                .collect(toList());
    }

    static void fillListTitle(List<WishDto> result) {
        List<String> listNames = result.stream().map(WishDto::getListId).distinct().collect(toList());
        Map<String, WishList> listTitles = WishListService.loadAll(listNames);
        result.forEach(envy -> {
            WishList wishList = listTitles.get(envy.getListId());
            if (wishList != null) {
                envy.setListTitle(wishList.getTitle());
            }
        });
    }

    static void cleanWishList(WishList list, WishListDto dto, AppUser user) {
        WishListState state = computeWishListState(user, list);
        dto.setState(state);
        switch (state) {
            case OWNER:
                dto.setOwner(true);
                break;
            case SHARED:
                break;
            case LOGGED:
                //Seul les informations des listes privés ne sont pas gardés.
                if (list.getPrivacy() != SharingPrivacyType.PRIVATE) {
                    break;
                }
            case ANONYMOUS:
                dto.setUsers(null);
                if (list.getPrivacy() == SharingPrivacyType.PUBLIC) {
                   // Si liste publique, toutes les informations sont publiques
                    break;
                }
            default: //Par défaut toutes les informations personnels sont nettoyés;
                dto.setOwners(null);
                dto.setUsers(null);
                dto.setDescription(null);
                dto.setDate(null);
        }
    }

    private static void fillUsersInWishList(WishListDto dto, WishList list, AppUser userEmail, Map<String, AppUser> map, boolean convertUsers) {
        List<UserShare> users = list.getUsers();
        List<UserShareDto> usersDto = new ArrayList<>();
        List<UserShareDto> ownersDto = new ArrayList<>();
        users.forEach(user -> {
            UserShareDto userShareDto = new UserShareDto(user.getEmail(), user.getType(), map);
            if (user.getType() == UserShareType.OWNER) {
                ownersDto.add(userShareDto);
            }
            if (convertUsers) {
                usersDto.add(userShareDto);
            }
        });
        if (convertUsers) {
            dto.setUsers(usersDto);
        }
        dto.setOwners(ownersDto);
        if (userEmail != null && userEmail.getEmail() != null) {
            dto.setOwner(list.containsOwner(userEmail.getEmail()));
        }
    }

    private static List<WishDto> computePermissions(List<WishDto> wishDtos, AppUser user, WishList wishList) {
        WishListState state = computeWishListState(user, wishList);
        wishDtos.forEach(wish -> {
            computePermissions(wish, user, wishList, state);
        });
        return wishDtos;
    }

    private static void computePermissions(WishDto wishDto, AppUser user, WishList wishList, WishListState state) {
        switch (state) {
            case OWNER:
                wishDto.setCanEdit(true);
                wishDto.setCanParticipate(false);
                wishDto.setCanSuggest(false);
                break;
            case SHARED:
                wishDto.setCanEdit(wishDto.getOwner().getEmail().equals(user.getEmail()));
                wishDto.setCanParticipate(true);
                wishDto.setCanSuggest(true);
                break;
            case LOGGED:
            case ANONYMOUS:
                wishDto.setCanEdit(false);
                wishDto.setCanParticipate(true);
                wishDto.setCanSuggest(false);
                break;
        }
        if (wishDto.getAllreadyGiven())
            wishDto.setCanParticipate(false);
        wishDto.setUserGiven(false);
        if (wishDto.getUserTake() != null && user != null) {
            for (PersonParticipantDto person : wishDto.getUserTake()) {
                if (person.getEmail().equals(user.getEmail())) {
                    wishDto.setUserGiven(true);
                }
            }
        }
    }

    static WishListState computeWishListState(AppUser user, WishList list) {
        if (user != null && !isNullOrEmpty(user.getEmail())) {
            if (list != null) {
                if (list.containsOwner(user.getEmail())) {
                    return WishListState.OWNER;
                }
                else if (list.containsUser(user.getEmail())) {
                    return WishListState.SHARED;
                }
            }
            return WishListState.LOGGED;
        }
        return WishListState.ANONYMOUS;
    }

    static WishOptionType computeWishOptionsType(AppUser user, WishList list) {
        WishListState state = computeWishListState(user, list);
        switch (state) {
            case OWNER:
                //Si une options est définie dans la liste, alors c'est l'option par défaut
                return WishOptionType.HIDDEN;
            case SHARED:
                return WishOptionType.ALL_SUGGEST;
            case LOGGED:
                if (list != null) {
                    if (list.getPrivacy() != null) {
                        switch (list.getPrivacy()) {
                            case PRIVATE:
                                return WishOptionType.NONE;
                            case OPEN:
                                return WishOptionType.ANONYMOUS;
                            case PUBLIC:
                                return WishOptionType.ALL_SUGGEST;
                        }
                    }
                    else {
                        return WishOptionType.NONE;
                    }
                }
                else {
                    return WishOptionType.ALL_SUGGEST; //All display for the given and archived page.
                }
            case ANONYMOUS:
                if (list != null && list.getPrivacy() != null) {
                    switch (list.getPrivacy()) {
                        case PRIVATE:
                            return WishOptionType.NONE;
                        case OPEN:
                            return WishOptionType.NONE;
                        case PUBLIC:
                            return WishOptionType.ANONYMOUS;
                    }
                }
                else {
                    return WishOptionType.NONE;
                }
        }
        return WishOptionType.ALL_SUGGEST;
    }

    static List<WishDto> filterWishList(List<WishDto> list, WishOptionType type) {
        if (type == WishOptionType.NONE)
            return new ArrayList<>();
        Stream<WishDto> stream = list.stream();
        if (type != WishOptionType.ALL_SUGGEST) {
            stream = stream.filter(WishRules::isNotSuggest);
        }
        return stream.map(wish -> cleanWish(wish, type)).collect(toList());
    }

    private static Boolean isNotSuggest(WishDto wish) {
        return !wish.getSuggest();
    }

    static WishDto cleanWish(WishDto wish, WishOptionType type) {

        switch (type) {
            case HIDDEN:
                wish.setUserTake(null);
                wish.setGiven(wish.getAllreadyGiven());
                if (!ListUtils.isNullOrEmpty(wish.getComments())) {
                    wish.setComments(wish.getComments().stream().filter(comment -> comment.getType() != CommentType.PRIVATE).collect(toList()));
                }
                break;
            case ANONYMOUS:
                wish.setUserTake(null);
                wish.setGiven(wish.getAllreadyGiven());
                if (!ListUtils.isNullOrEmpty(wish.getComments())) {
                    wish.setComments(wish.getComments().stream().filter(comment -> comment.getType() == CommentType.PUBLIC).collect(toList()));
                }
                break;
            case ALL:
            case ALL_SUGGEST:
                break;
        }
        return wish;
    }
}
