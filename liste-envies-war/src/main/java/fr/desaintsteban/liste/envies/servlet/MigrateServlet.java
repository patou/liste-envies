package fr.desaintsteban.liste.envies.servlet;

import com.googlecode.objectify.Key;
import com.googlecode.objectify.Objectify;
import fr.desaintsteban.liste.envies.enums.SharingPrivacyType;
import fr.desaintsteban.liste.envies.enums.WishListType;
import fr.desaintsteban.liste.envies.model.*;
import fr.desaintsteban.liste.envies.model.deprecated.Envy;
import fr.desaintsteban.liste.envies.model.deprecated.ListEnvies;
import fr.desaintsteban.liste.envies.model.deprecated.Note;
import fr.desaintsteban.liste.envies.service.OfyService;
import fr.desaintsteban.liste.envies.util.EncodeUtils;
import fr.desaintsteban.liste.envies.util.NicknameUtils;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import static fr.desaintsteban.liste.envies.util.StringUtils.isNullOrEmpty;
import static java.util.stream.Collectors.toMap;

/**
 *
 */
public class MigrateServlet extends HttpServlet {

    private Map<String, AppUser> users;

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("text/plain;charset=UTF-8");
        PrintWriter out = resp.getWriter();
        Objectify ofy = OfyService.ofy();

        loadUsers(ofy);


        List<ListEnvies> list = ofy.load().type(ListEnvies.class).list();
        List<WishList> listConverted = new ArrayList<>();
        List<Wish> ConvertedWish = new ArrayList<>();

        for (ListEnvies listEnvy : list) {
            WishList newWishList = convertListeEnvyToWishList(listEnvy);

            // convert Envies
            Key<ListEnvies> key = Key.create(ListEnvies.class, listEnvy.getName());
            Key<WishList> newKey = Key.create(WishList.class, listEnvy.getName());
            List<Envy> Envies = ofy.load().type(Envy.class).ancestor(key).list();

            for(Envy envy : Envies) {
                Wish newWish = convertEnvyToWish(newWishList, envy);
                ConvertedWish.add(newWish);
            }

            listConverted.add(newWishList);
        }
        ofy.save().entities(listConverted);
        ofy.save().entities(ConvertedWish);

        out.println("OK");
    }

    private void loadUsers(Objectify ofy) {
        List<AppUser> ListUsers = ofy.load().type(AppUser.class).list();

        users = ListUsers.stream().collect(toMap(AppUser::getEmail, Function.identity()));
    }

    WishList convertListeEnvyToWishList(ListEnvies listEnvy) {
        WishList newWishList = new WishList();

        newWishList.setName(listEnvy.getName());
        newWishList.setTitle(listEnvy.getTitle());
        newWishList.setDescription(listEnvy.getDescription());
        newWishList.setUsers(listEnvy.getUsers());
        newWishList.setPrivacy(SharingPrivacyType.PRIVATE);
        newWishList.setPicture("img/default.jpg"); //use a default image, for type other
        newWishList.setType(WishListType.OTHER);
        return newWishList;
    }

    Wish convertEnvyToWish(WishList newWishList, Envy envy) {
        Wish newWish = new Wish(newWishList, envy.getLabel());
        newWish.setOwner(toPerson(envy.getOwner(), false));
        newWish.setSuggest(envy.getSuggest());
        newWish.setArchived(envy.getArchived());
        newWish.setDeleted(envy.getDeleted());
        newWish.setDescription(envy.getDescription());
        newWish.setPrice(envy.getPrice());
        newWish.setPictures(toList(envy.getPicture()));
        newWish.setDate(envy.getDate());
        newWish.setUrls(envy.getUrls());
        newWish.setRating(envy.getRating());
        newWish.setUserTake(toParticipant(envy.getUserTake()));
        newWish.setUserReceived(envy.getUserReceived());
        newWish.setComments(envy.getNotes().stream().map(Note::toComment).collect(Collectors.toList()));
        return newWish;
    }

    private List<PersonParticipant> toParticipant(List<String> userTake) {
        if (userTake != null) {
            return userTake.stream().map(EncodeUtils::decode).map(this::toParticipant).collect(Collectors.toList());
        }
        return null;
    }

    Person toPerson(String email, boolean encode) {
        if (!isNullOrEmpty(email)) {
            Person person = new Person(encode);
            person.setEmail(email);
            AppUser appUser = this.users.get(email);
            if (appUser != null)
                person.setName(appUser.getEmail());
            else
                person.setName(NicknameUtils.getNickname(email));
            return person;
        }
        return null;
    }

    PersonParticipant toParticipant(String email) {
        if (!isNullOrEmpty(email)) {
            PersonParticipant person = new PersonParticipant();
            person.setEmail(email);
            AppUser appUser = this.users.get(email);
            if (appUser != null)
                person.setName(appUser.getEmail());
            else
                person.setName(email);
            return person;
        }
        return null;
    }

    static List<String> toList(String picture) {
        if (picture != null) {
            ArrayList<String> list = new ArrayList<>();
            list.add(picture);
            return list;
        }
        return null;
    }
}
