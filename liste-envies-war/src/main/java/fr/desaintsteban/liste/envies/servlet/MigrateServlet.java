package fr.desaintsteban.liste.envies.servlet;

import com.googlecode.objectify.Key;
import com.googlecode.objectify.Objectify;
import fr.desaintsteban.liste.envies.model.AppUser;
import fr.desaintsteban.liste.envies.model.Envie;
import fr.desaintsteban.liste.envies.model.Envy;
import fr.desaintsteban.liste.envies.model.ListEnvies;
import fr.desaintsteban.liste.envies.model.UserShare;
import fr.desaintsteban.liste.envies.model.UserShareType;
import fr.desaintsteban.liste.envies.service.OfyService;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;

/**
 *
 */
public class MigrateServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("text/plain;charset=UTF-8");
        PrintWriter out = resp.getWriter();
        Objectify ofy = OfyService.ofy();
        List<AppUser> listUser = ofy.load().type(AppUser.class).list();
        for (AppUser appUser : listUser) {
            out.println("Liste de "+appUser.getName());
            ListEnvies envies = new ListEnvies();
            envies.setName("list-"+appUser.getName().toLowerCase());
            envies.setTitle("Liste de " + appUser.getName());
            List<UserShare> users = new ArrayList<>();
            users.add(new UserShare(appUser.getEmail(), UserShareType.OWNER));
            for (AppUser shareUser : listUser) {
                if (!shareUser.getEmail().equals(appUser.getEmail())) {
                    users.add(new UserShare(shareUser.getEmail(), UserShareType.SHARED));
                }
            }
            envies.setUsers(users);

            Key<ListEnvies> key = ofy.save().entity(envies).now();

            List<Envie> list = ofy.load().type(Envie.class).ancestor(appUser).list();
            List<Envy> listConverted = new ArrayList<>();
            for (Envie envie : list) {
                Envy envy = new Envy();
                envy.setList(key);
                envy.setOwner(envie.getOwner().getName());
                envy.setLabel(envie.getLabel());
                envy.setDescription(envie.getComment());
                envy.setPrice(envie.getPrice());
                envy.setUrl(envie.getUrl());
                envy.setNotes(envie.getNotes());
                envy.setUserTake(envie.getUserTake());
                listConverted.add(envy);
            }
            ofy.save().entities(listConverted);
        }

        out.println("OK");
    }
}
