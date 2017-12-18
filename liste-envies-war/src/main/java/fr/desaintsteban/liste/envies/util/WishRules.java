package fr.desaintsteban.liste.envies.util;

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
        computePermissions(wishDto, user, wishList);
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
        wishDtos.forEach(wish -> {
            computePermissions(wish, user, wishList);
        });
        return wishDtos;
    }

    private static void computePermissions(WishDto wishDto, AppUser user, WishList wishList) {
            //TODO compute canEdit, canRemove, canComment, etc ...
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
                if (list.getOption() != null) {
                    return list.getOption();
                }
                return WishOptionType.HIDDEN;
            case SHARED:
                return WishOptionType.ALL_SUGGEST;
            case LOGGED:
                if (list != null) {
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
                    return WishOptionType.ANONYMOUS;
                }
            case ANONYMOUS:
                if (list != null) {
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
                    return WishOptionType.HIDDEN;
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
        if (wish.getUserTake() != null  && wish.getUserTake().size() > 0) {
            wish.setGiven(true);
        }
        switch (type) {
            case HIDDEN:
                wish.setUserTake(null);
                if (!ListUtils.isNullOrEmpty(wish.getComments())) {
                    wish.setComments(wish.getComments().stream().filter(comment -> comment.getType() != CommentType.PRIVATE).collect(toList()));
                }
                break;
            case ANONYMOUS:
                wish.setUserTake(null);
                wish.setGiven(false);
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
