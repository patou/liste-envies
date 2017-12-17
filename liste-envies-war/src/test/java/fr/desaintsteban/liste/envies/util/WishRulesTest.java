package fr.desaintsteban.liste.envies.util;

import fr.desaintsteban.liste.envies.enums.*;
import fr.desaintsteban.liste.envies.model.*;
import org.junit.Test;

import java.util.ArrayList;
import java.util.List;

import static org.fest.assertions.Assertions.assertThat;
import static org.junit.Assert.assertEquals;


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
        List<Wish> wishList = createDefaultListOfWish();

        List<Wish> cleaned = WishRules.filterWishList(wishList, WishOptionType.ALL);

        assertThat(cleaned).isNotNull().hasSize(1);
    }


    @Test
    public void filterWishAllSuggest() {
        List<Wish> wishList = createDefaultListOfWish();

        List<Wish> cleaned = WishRules.filterWishList(wishList, WishOptionType.ALL_SUGGEST);

        assertThat(cleaned).isNotNull().hasSize(2);
    }

    @Test
    public void filterWishNone() {
        List<Wish> wishList = createDefaultListOfWish();

        List<Wish> cleaned = WishRules.filterWishList(wishList, WishOptionType.NONE);

        assertThat(cleaned).isNotNull().hasSize(0);
    }

    @Test
    public void testComputeWishListState() {
        WishList wishlist = createDefaultWishList();

        assertEquals(WishListState.OWNER, WishRules.computeWishListState(new AppUser("patrice@desaintsteban.fr"), wishlist));
        assertEquals(WishListState.SHARED, WishRules.computeWishListState(new AppUser("emmanuel@desaintsteban.fr"), wishlist));
        assertEquals(WishListState.LOGGED, WishRules.computeWishListState(new AppUser("emeline@desaintsteban.fr"), wishlist));
        assertEquals(WishListState.ANONYMOUS, WishRules.computeWishListState(new AppUser(null, "Anonyme"), wishlist));
        assertEquals(WishListState.ANONYMOUS, WishRules.computeWishListState(null, wishlist));

    }

    @Test
    public void testComputeWishOptionType() {
        WishList wishlist = createDefaultWishList();

        assertEquals(WishOptionType.HIDDEN, WishRules.computeWishOptionsType(new AppUser("patrice@desaintsteban.fr"), wishlist));
        assertEquals(WishOptionType.ALL_SUGGEST, WishRules.computeWishOptionsType(new AppUser("emmanuel@desaintsteban.fr"), wishlist));
        assertEquals(WishOptionType.NONE, WishRules.computeWishOptionsType(new AppUser("emeline@desaintsteban.fr"), wishlist));
        assertEquals(WishOptionType.NONE, WishRules.computeWishOptionsType(new AppUser(null, "Anonyme"), wishlist));
        assertEquals(WishOptionType.NONE, WishRules.computeWishOptionsType(null, wishlist));

        wishlist.setOption(WishOptionType.ANONYMOUS);

        assertEquals(WishOptionType.ANONYMOUS, WishRules.computeWishOptionsType(new AppUser("patrice@desaintsteban.fr"), wishlist));

        wishlist.setPrivacy(SharingPrivacyType.PRIVATE);
        assertEquals(WishOptionType.NONE, WishRules.computeWishOptionsType(new AppUser("emeline@desaintsteban.fr"), wishlist));
        assertEquals(WishOptionType.NONE, WishRules.computeWishOptionsType(new AppUser(null, "Anonyme"), wishlist));
        assertEquals(WishOptionType.NONE, WishRules.computeWishOptionsType(null, wishlist));

        wishlist.setPrivacy(SharingPrivacyType.OPEN);
        assertEquals(WishOptionType.ANONYMOUS, WishRules.computeWishOptionsType(new AppUser("emeline@desaintsteban.fr"), wishlist));
        assertEquals(WishOptionType.NONE, WishRules.computeWishOptionsType(new AppUser(null, "Anonyme"), wishlist));
        assertEquals(WishOptionType.NONE, WishRules.computeWishOptionsType(null, wishlist));

        wishlist.setPrivacy(SharingPrivacyType.PUBLIC);
        assertEquals(WishOptionType.ALL_SUGGEST, WishRules.computeWishOptionsType(new AppUser("emeline@desaintsteban.fr"), wishlist));
        assertEquals(WishOptionType.ANONYMOUS, WishRules.computeWishOptionsType(new AppUser(null, "Anonyme"), wishlist));
        assertEquals(WishOptionType.ANONYMOUS, WishRules.computeWishOptionsType(null, wishlist));
    }

    private WishList createDefaultWishList() {
        WishList list = new WishList();
        List<UserShare> users = new ArrayList<>();
        users.add(new UserShare("patrice@desaintsteban.fr", UserShareType.OWNER));
        users.add(new UserShare("emmanuel@desaintsteban.fr", UserShareType.SHARED));
        list.setUsers(users);
        return list;
    }

    private Wish createDefaultWish() {
        Wish wish = new Wish();
        wish.addUserTake(new PersonParticipant("patrice@desaintsteban.fr"));
        wish.addComment(new Comment(new Person("emmanuel@desaintsteban.fr"), "Public", CommentType.PUBLIC));
        wish.addComment(new Comment(new Person("emmanuel@desaintsteban.fr"), "Private", CommentType.PRIVATE));
        wish.addComment(new Comment(new Person("emmanuel@desaintsteban.fr"), "Owner", CommentType.OWNER));
        return wish;
    }

    private List<Wish> createDefaultListOfWish() {

        List<Wish> wishList = new ArrayList<>();
        wishList.add(createDefaultWish());
        Wish wish = createDefaultWish();
        wish.setSuggest(true);
        wishList.add(wish);
        return wishList;
    }

}