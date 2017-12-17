package fr.desaintsteban.liste.envies.util;

import fr.desaintsteban.liste.envies.enums.CommentType;
import fr.desaintsteban.liste.envies.enums.WishOptionType;
import fr.desaintsteban.liste.envies.model.Wish;
import fr.desaintsteban.liste.envies.model.WishList;

import java.util.List;
import java.util.function.Predicate;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * This class is for save all list
 */
public class WishRules {

    /*function ApplyRulesForList (WishList list) {
        WishListDto listDto = list.toDto();



        return
    }*/

    public static List<Wish> filterWishList(List<Wish> list, WishOptionType type) {
        Stream<Wish> stream = list.stream();
        if (type != WishOptionType.ALL_SUGGEST) {
            stream = stream.filter(WishRules::isNotSuggest);
        }
        return stream.map(wish -> cleanWish(wish, type)).collect(Collectors.toList());
    }

    private static Boolean isNotSuggest(Wish wish) {
        return !wish.getSuggest();
    }

    public static Wish cleanWish(Wish wish, WishOptionType type) {
        switch (type) {
            case HIDDEN:
                wish.setUserTake(null);
                wish.setComments(wish.getComments().stream().filter(comment -> comment.getType() != CommentType.PRIVATE).collect(Collectors.toList()));
                break;
            case ANONYMOUS:
                wish.setUserTake(null);
                wish.setComments(wish.getComments().stream().filter(comment -> comment.getType() == CommentType.PUBLIC).collect(Collectors.toList()));
                break;
            case ALL:
            case ALL_SUGGEST:
                break;
        }
        return wish;
    }
}
