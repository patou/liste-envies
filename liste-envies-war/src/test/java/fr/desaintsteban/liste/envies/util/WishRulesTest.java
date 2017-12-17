package fr.desaintsteban.liste.envies.util;

import fr.desaintsteban.liste.envies.enums.CommentType;
import fr.desaintsteban.liste.envies.enums.WishOptionType;
import fr.desaintsteban.liste.envies.model.Comment;
import fr.desaintsteban.liste.envies.model.Person;
import fr.desaintsteban.liste.envies.model.PersonParticipant;
import fr.desaintsteban.liste.envies.model.Wish;
import org.junit.Test;

import java.util.ArrayList;
import java.util.List;

import static org.fest.assertions.Assertions.assertThat;


public class WishRulesTest {

    @Test
    public void cleanWishAnonyme() {
        Wish wish = createDefaultWish();

        Wish cleaned = WishRules.cleanWish(wish, WishOptionType.ANONYMOUS);

        assertThat(cleaned.getUserTake()).isNull();
        assertThat(cleaned.getComments()).hasSize(1).onProperty("text").contains("Public");
    }

    @Test
    public void cleanWishHidden() {
        Wish wish = createDefaultWish();

        Wish cleaned = WishRules.cleanWish(wish, WishOptionType.HIDDEN);

        assertThat(cleaned.getUserTake()).isNull();
        assertThat(cleaned.getComments()).hasSize(2).onProperty("text").contains("Public", "Owner");
    }


    @Test
    public void cleanWishAll() {
        Wish wish = createDefaultWish();

        Wish cleaned = WishRules.cleanWish(wish, WishOptionType.ALL);

        assertThat(cleaned.getUserTake()).isNotNull().hasSize(1).onProperty("email").contains("patrice@desaintsteban.fr");
        assertThat(cleaned.getComments()).hasSize(3).onProperty("text").contains("Public", "Owner", "Private");
    }

    @Test
    public void filterWishAll() {
        List<Wish> wishList = createDefaultWishList();

        List<Wish> cleaned = WishRules.filterWishList(wishList, WishOptionType.ALL);

        assertThat(cleaned).isNotNull().hasSize(1);
    }


    @Test
    public void filterWishAllSuggest() {
        List<Wish> wishList = createDefaultWishList();

        List<Wish> cleaned = WishRules.filterWishList(wishList, WishOptionType.ALL_SUGGEST);

        assertThat(cleaned).isNotNull().hasSize(2);
    }

    private Wish createDefaultWish() {
        Wish wish = new Wish();
        wish.addUserTake(new PersonParticipant("patrice@desaintsteban.fr"));
        wish.addComment(new Comment(new Person("emmanuel@desaintsteban.fr"), "Public", CommentType.PUBLIC));
        wish.addComment(new Comment(new Person("emmanuel@desaintsteban.fr"), "Private", CommentType.PRIVATE));
        wish.addComment(new Comment(new Person("emmanuel@desaintsteban.fr"), "Owner", CommentType.OWNER));
        return wish;
    }

    private List<Wish> createDefaultWishList() {

        List<Wish> wishList = new ArrayList<>();
        wishList.add(createDefaultWish());
        Wish wish = createDefaultWish();
        wish.setSuggest(true);
        wishList.add(wish);
        return wishList;
    }

}