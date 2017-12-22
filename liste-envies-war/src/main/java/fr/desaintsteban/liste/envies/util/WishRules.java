package fr.desaintsteban.liste.envies.util;

import fr.desaintsteban.liste.envies.dto.PersonParticipantDto;
import fr.desaintsteban.liste.envies.dto.WishDto;
import fr.desaintsteban.liste.envies.enums.CommentType;
import fr.desaintsteban.liste.envies.enums.WishListState;
import fr.desaintsteban.liste.envies.enums.WishOptionType;
import fr.desaintsteban.liste.envies.model.AppUser;
import fr.desaintsteban.liste.envies.model.Wish;
import fr.desaintsteban.liste.envies.model.WishList;
import fr.desaintsteban.liste.envies.service.WishListService;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Predicate;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static fr.desaintsteban.liste.envies.util.StringUtils.isNullOrEmpty;
import static java.util.stream.Collectors.toList;

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
                break;
            case SHARED:
                wishDto.setCanEdit(wishDto.getOwner().getEmail().equals(user.getEmail()));
                wishDto.setCanParticipate(true);
                break;
            case LOGGED:
            case ANONYMOUS:
                wishDto.setCanEdit(false);
                wishDto.setCanParticipate(true);
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
