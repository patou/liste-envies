package fr.desaintsteban.liste.envies.util;

import fr.desaintsteban.liste.envies.dto.WishDto;
import fr.desaintsteban.liste.envies.enums.CommentType;
import fr.desaintsteban.liste.envies.enums.WishListState;
import fr.desaintsteban.liste.envies.enums.WishOptionType;
import fr.desaintsteban.liste.envies.model.AppUser;
import fr.desaintsteban.liste.envies.model.Wish;
import fr.desaintsteban.liste.envies.model.WishList;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Predicate;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static fr.desaintsteban.liste.envies.util.StringUtils.isNullOrEmpty;

/**
 * This class is for save all list
 */
public class WishRules {

    /*function ApplyRulesForList (WishList list) {
        WishListDto listDto = list.toDto();



        return
    }*/

    public static WishListState computeWishListState(AppUser user, WishList list) {
        if (user != null && !isNullOrEmpty(user.getEmail())) {
            if (list.containsOwner(user.getEmail())) {
                return WishListState.OWNER;
            }
            if (list.containsUser(user.getEmail())) {
                return WishListState.SHARED;
            }
            return WishListState.LOGGED;
        }
        return WishListState.ANONYMOUS;
    }

    public static WishOptionType computeWishOptionsType(AppUser user, WishList list) {
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
                switch (list.getPrivacy()) {
                    case PRIVATE:
                        return WishOptionType.NONE;
                    case OPEN:
                        return WishOptionType.ANONYMOUS;
                    case PUBLIC:
                        return WishOptionType.ALL_SUGGEST;
                }
            case ANONYMOUS:
                switch (list.getPrivacy()) {
                    case PRIVATE:
                        return WishOptionType.NONE;
                    case OPEN:
                        return WishOptionType.NONE;
                    case PUBLIC:
                        return WishOptionType.ANONYMOUS;
                }

        }
        return WishOptionType.ALL_SUGGEST;
    }

    public static List<WishDto> filterWishList(List<WishDto> list, WishOptionType type) {
        if (type == WishOptionType.NONE)
            return new ArrayList<>();
        Stream<WishDto> stream = list.stream();
        if (type != WishOptionType.ALL_SUGGEST) {
            stream = stream.filter(WishRules::isNotSuggest);
        }
        return stream.map(wish -> cleanWish(wish, type)).collect(Collectors.toList());
    }

    private static Boolean isNotSuggest(WishDto wish) {
        return !wish.getSuggest();
    }

    public static WishDto cleanWish(WishDto wish, WishOptionType type) {
        if (wish.getUserTake() != null  && wish.getUserTake().size() > 0) {
            wish.setGiven(true);
        }
        switch (type) {
            case HIDDEN:
                wish.setUserTake(null);
                wish.setComments(wish.getComments().stream().filter(comment -> comment.getType() != CommentType.PRIVATE).collect(Collectors.toList()));
                break;
            case ANONYMOUS:
                wish.setUserTake(null);
                wish.setGiven(false);
                wish.setComments(wish.getComments().stream().filter(comment -> comment.getType() == CommentType.PUBLIC).collect(Collectors.toList()));
                break;
            case ALL:
            case ALL_SUGGEST:
                break;
        }
        return wish;
    }
}
