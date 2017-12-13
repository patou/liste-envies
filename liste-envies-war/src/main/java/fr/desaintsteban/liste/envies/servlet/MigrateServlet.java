package fr.desaintsteban.liste.envies.servlet;

import com.googlecode.objectify.Key;
import com.googlecode.objectify.LoadResult;
import com.googlecode.objectify.Objectify;
import fr.desaintsteban.liste.envies.model.Wish;
import fr.desaintsteban.liste.envies.model.deprecated.Envy;
import fr.desaintsteban.liste.envies.model.deprecated.ListEnvies;
import fr.desaintsteban.liste.envies.model.WishList;
import fr.desaintsteban.liste.envies.service.OfyService;
import fr.desaintsteban.liste.envies.util.EncodeUtils;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 *
 */
public class MigrateServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("text/plain;charset=UTF-8");
        PrintWriter out = resp.getWriter();
        Objectify ofy = OfyService.ofy();
        List<ListEnvies> list = ofy.load().type(ListEnvies.class).list();
        List<WishList> listConverted = new ArrayList<>();
        List<Wish> ConvertedWish = new ArrayList<>();

        for (ListEnvies listEnvy : list) {
            WishList newWishList = new WishList();

            newWishList.setName(listEnvy.getName());
            newWishList.setTitle(listEnvy.getTitle());
            newWishList.setDescription(listEnvy.getDescription());
            newWishList.setUsers(listEnvy.getUsers());

            // convert Envies
            Key<ListEnvies> key = Key.create(ListEnvies.class, listEnvy.getName());
            Key<WishList> newKey = Key.create(WishList.class, listEnvy.getName());
            List<Envy> Envies = ofy.load().type(Envy.class).ancestor(key).list();

            for(Envy envy : Envies) {
                Wish newWish = new Wish(newWishList, envy.getLabel());
                newWish.setOwner(envy.getOwner());
                newWish.setSuggest(envy.getSuggest());
                newWish.setArchived(envy.getArchived());
                newWish.setDeleted(envy.getDeleted());
                newWish.setDescription(envy.getDescription());
                newWish.setPrice(envy.getPrice());
                newWish.setPicture(envy.getPicture());
                newWish.setDate(envy.getDate());
                newWish.setUrls(envy.getUrls());
                newWish.setRating(envy.getRating());
                newWish.setUserTake(envy.getUserTake());
                newWish.setUserReceived(envy.getUserReceived());
                newWish.setNotes(envy.getNotes());



                ConvertedWish.add(newWish);
            }

            listConverted.add(newWishList);
        }
        ofy.save().entities(listConverted);
        ofy.save().entities(ConvertedWish);

        out.println("OK");
    }
}
