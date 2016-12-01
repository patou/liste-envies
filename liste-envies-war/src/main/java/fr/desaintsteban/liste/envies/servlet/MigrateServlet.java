package fr.desaintsteban.liste.envies.servlet;

import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.VoidWork;
import fr.desaintsteban.liste.envies.model.Envie;
import fr.desaintsteban.liste.envies.model.Note;
import fr.desaintsteban.liste.envies.service.OfyService;
import fr.desaintsteban.liste.envies.util.EncodeUtils;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

/**
 *
 */
public class MigrateServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Objectify ofy = OfyService.ofy();
        List<Envie> list = ofy.load().type(Envie.class).list();
        for (Envie envie : list) {
            if (envie.getUserTake() != null) {
                envie.setUserTake(EncodeUtils.encode(envie.getUserTake()));
            }
            if (envie.getNotes() != null) {
                for (Note note : envie.getNotes()) {
                    note.setOwner(EncodeUtils.encode(note.getOwner()));
                    note.setText(EncodeUtils.encode(note.getText()));
                }
            }
        }
        ofy.save().entities(list);
    }
}
