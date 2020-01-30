package fr.desaintsteban.liste.envies.util;

import fr.desaintsteban.liste.envies.dto.WishDto;
import fr.desaintsteban.liste.envies.dto.WishListDto;
import fr.desaintsteban.liste.envies.enums.*;
import fr.desaintsteban.liste.envies.model.*;
import org.junit.Test;

import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.extractProperty;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;


public class WishRulesTest {

    @Test
    public void cleanWishAnonyme() {
        WishDto wish = createDefaultWish();

        WishDto cleaned = WishRules.cleanWish(wish, WishOptionType.ANONYMOUS);

        assertThat(cleaned.getUserTake()).isNull();
        assertThat(extractProperty("text").from(cleaned.getComments())).hasSize(1).contains("Public");
    }

    @Test
    public void cleanWishHidden() {
        WishDto wish = createDefaultWish();

        WishDto cleaned = WishRules.cleanWish(wish, WishOptionType.HIDDEN);

        assertThat(cleaned.getUserTake()).isNull();
        assertThat(extractProperty("text").from(cleaned.getComments())).hasSize(2).contains("Public", "Owner");
    }


    @Test
    public void cleanWishAll() {
        WishDto wish = createDefaultWish();

        WishDto cleaned = WishRules.cleanWish(wish, WishOptionType.ALL);

        assertThat(extractProperty("email").from(cleaned.getUserTake())).hasSize(1).contains("patrice@desaintsteban.fr");
        assertThat(extractProperty("text").from(cleaned.getComments())).hasSize(3).contains("Public", "Owner", "Private");
    }

    @Test
    public void filterWishAll() {
        List<WishDto> wishList = createDefaultListOfWish();

        List<WishDto> cleaned = WishRules.filterWishList(wishList, WishOptionType.ALL);

        assertThat(cleaned).isNotNull().hasSize(1);
    }


    @Test
    public void filterWishAllSuggest() {
        List<WishDto> wishList = createDefaultListOfWish();

        List<WishDto> cleaned = WishRules.filterWishList(wishList, WishOptionType.ALL_SUGGEST);

        assertThat(cleaned).isNotNull().hasSize(2);
    }

    @Test
    public void filterWishNone() {
        List<WishDto> wishList = createDefaultListOfWish();

        List<WishDto> cleaned = WishRules.filterWishList(wishList, WishOptionType.NONE);

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

    @Test
    public void testComputePermissionWishList() {
        WishList wishlist = createDefaultWishList();
        WishListDto dto = new WishListDto();

        WishRules.computePermissions(dto, wishlist, new AppUser("patrice@desaintsteban.fr"));
        assertTrue(dto.getOwner());
        assertFalse(dto.getCanSuggest());

        WishRules.computePermissions(dto, wishlist, new AppUser("emmanuel@desaintsteban.fr"));
        assertFalse(dto.getOwner());
        assertTrue(dto.getCanSuggest());

        WishRules.computePermissions(dto, wishlist, new AppUser("emeline@desaintsteban.fr"));
        assertFalse(dto.getOwner());
        assertTrue(dto.getCanSuggest());

        WishRules.computePermissions(dto, wishlist, new AppUser(null, "Anonyme"));
        assertFalse(dto.getOwner());
        assertFalse(dto.getCanSuggest());
    }

    private WishList createDefaultWishList() {
        WishList list = new WishList();
        List<UserShare> users = new ArrayList<>();
        users.add(new UserShare("patrice@desaintsteban.fr", UserShareType.OWNER));
        users.add(new UserShare("emmanuel@desaintsteban.fr", UserShareType.SHARED));
        list.setUsers(users);
        return list;
    }

    private WishDto createDefaultWish() {
        Wish wish = new Wish();
        wish.addUserTake(new PersonParticipant("patrice@desaintsteban.fr"));
        wish.addComment(new Comment(new Person("emmanuel@desaintsteban.fr"), "Public", CommentType.PUBLIC));
        wish.addComment(new Comment(new Person("emmanuel@desaintsteban.fr"), "Private", CommentType.PRIVATE));
        wish.addComment(new Comment(new Person("emmanuel@desaintsteban.fr"), "Owner", CommentType.OWNER));
        return wish.toDto();
    }

    private List<WishDto> createDefaultListOfWish() {

        List<WishDto> wishList = new ArrayList<>();
        wishList.add(createDefaultWish());
        WishDto wish = createDefaultWish();
        wish.setSuggest(true);
        wishList.add(wish);
        return wishList;
    }

}
