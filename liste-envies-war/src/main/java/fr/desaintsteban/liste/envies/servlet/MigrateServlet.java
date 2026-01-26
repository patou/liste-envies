package fr.desaintsteban.liste.envies.servlet;

import com.googlecode.objectify.Objectify;
import fr.desaintsteban.liste.envies.enums.SharingPrivacyType;
import fr.desaintsteban.liste.envies.enums.WishListType;
import fr.desaintsteban.liste.envies.enums.WishState;
import fr.desaintsteban.liste.envies.model.AppUser;
import fr.desaintsteban.liste.envies.model.Person;
import fr.desaintsteban.liste.envies.model.PersonParticipant;
import fr.desaintsteban.liste.envies.model.Wish;
import fr.desaintsteban.liste.envies.model.WishList;
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
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import static fr.desaintsteban.liste.envies.util.StringUtils.isNullOrEmpty;
import static java.util.stream.Collectors.toMap;

/**
 *
 */
@SuppressWarnings("RedundantThrows")
public class MigrateServlet extends HttpServlet {

    private Map<String, AppUser> users;

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("text/plain;charset=UTF-8");
        PrintWriter out = resp.getWriter();
        Objectify ofy = OfyService.ofy();

        loadUsers(ofy);
        List<WishList> listConverted = new ArrayList<>();
        List<Wish> ConvertedWish = new ArrayList<>();
        List<WishList> listWishList = ofy.load().type(WishList.class).list();

        //Convert
        listWishList.forEach(wishList -> {
            List<Wish> Envies = ofy.load().type(Wish.class).ancestor(wishList.getKey()).list();
            wishList.resetCounts();
            for (Wish envy : Envies) {
                //Convert archived and deleted to state
                wishList.incrCounts(envy.getState());
                ConvertedWish.add(envy);
            }
            listConverted.add(wishList);
            out.println(String.format("%s: %d draft, %d active, %d archived, %d deleted", wishList.getName(), wishList.getCounts(WishState.DRAFT), wishList.getCounts(WishState.ACTIVE), wishList.getCounts(WishState.ARCHIVED), wishList.getCounts(WishState.DELETED)));
        });

        ofy.save().entities(listConverted);
        ofy.save().entities(ConvertedWish);

        out.println("OK");
    }

    private void loadUsers(Objectify ofy) {
        List<AppUser> ListUsers = ofy.load().type(AppUser.class).list();

        users = ListUsers.stream().collect(toMap(AppUser::getEmail, Function.identity()));
    }
}
