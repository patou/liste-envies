package fr.desaintsteban.liste.envies.service;

import com.googlecode.objectify.Key;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.VoidWork;
import com.googlecode.objectify.Work;
import com.googlecode.objectify.cmd.Saver;
import fr.desaintsteban.liste.envies.dto.NoteDto;
import fr.desaintsteban.liste.envies.model.AppUser;
import fr.desaintsteban.liste.envies.model.Envie;

import java.util.List;

public final class EnviesService {
    private EnviesService() {}
    
    public static List<Envie> list(AppUser user, String email) {
        Key<AppUser> parent = Key.create(AppUser.class, email);
        List<Envie> list = OfyService.ofy().load().type(Envie.class).ancestor(parent).list();
        if (user.getEmail().equals(email)) {
            removeUserTake(list);
        }
        return list;
    }

    public static List<Envie> listAll() {
        List<Envie> list = OfyService.ofy().load().type(Envie.class).list();
        //On supprime toujours celui qui a donner le cadeaux
        removeUserTake(list);
        return list;
    }

    public static List<Envie> list(AppUser user, String email, String libelle) {
        Key<AppUser> parent = Key.create(AppUser.class, email);
        List<Envie> list = OfyService.ofy().load().type(Envie.class).ancestor(parent).filter("label >=", libelle).filter("label <", libelle + "\uFFFD").list();
        if (user.getEmail().equals(email)) {
            removeUserTake(list);
        }
        return list;
    }
    
    public static void delete(AppUser user, String email, Long itemid) {
        Key<AppUser> parent = Key.create(AppUser.class, email);
        if (user.getEmail().equals(email) || user.isAdmin()) {
            OfyService.ofy().delete().key(Key.create(parent, Envie.class, itemid)).now();
        }
    }

    public static Envie get(AppUser user, String email, Long itemid) {
        Key<AppUser> parent = Key.create(AppUser.class, email);
        Envie envie = OfyService.ofy().load().key(Key.create(parent, Envie.class, itemid)).now();
        if (user.getEmail().equals(email)) {
            envie.setUserTake(null);
            envie.setNotes(null);
        }
        return envie;
    }

    public static void given(final AppUser user, String email, final Long itemId) {
        if (user.getEmail().equals(email)) {

        }
        else if (!user.getEmail().equals(email)) {
            final Key<AppUser> parent = Key.create(AppUser.class, email);
            OfyService.ofy().transact(new VoidWork() {
                @Override
                public void vrun() {
                    Objectify ofy = OfyService.ofy();
                    Envie saved = ofy.load().key(Key.create(parent, Envie.class, itemId)).now();
                    Saver saver = ofy.save();
                    saved.setUserTake(user.getEmail());
                    saver.entity(saved);
                }
            });
        }
    }

    public static void addNote(final AppUser user, final Long itemId, final String email, final NoteDto note) {

        if (user.getEmail().equals(email)) {

        }
        else if (!user.getEmail().equals(email)) {
            final Key<AppUser> parent = Key.create(AppUser.class, email);
            OfyService.ofy().transact(new VoidWork() {
                @Override
                public void vrun() {
                    Objectify ofy = OfyService.ofy();
                    Envie saved = ofy.load().key(Key.create(parent, Envie.class, itemId)).now();
                    Saver saver = ofy.save();
                    saved.addNote(user.getName(), note.getText());
                    saver.entity(saved);
                }
            });
        }
    }

    public static void cancel(final AppUser user, String email,  final Long itemId) {
        if (user.getEmail().equals(email)) {

        }
        else if (!user.getEmail().equals(email)) {
            final Key<AppUser> parent = Key.create(AppUser.class, email);
            OfyService.ofy().transact(new VoidWork() {
                @Override
                public void vrun() {
                    Objectify ofy = OfyService.ofy();
                    Envie saved = ofy.load().key(Key.create(parent, Envie.class, itemId)).now();
                    Saver saver = ofy.save();
                    saved.setUserTake(null);
                    saver.entity(saved);
                }
            });
        }
    }
    
    public static Envie createOrUpdate(final AppUser user, final String email, final Envie item) {
        if (user.getEmail().equals(email)) {
            final Key<AppUser> parent = Key.create(AppUser.class, email);
            return OfyService.ofy().transact(new Work<Envie>() {
                @Override
                public Envie run() {
                    Objectify ofy = OfyService.ofy();
                    Saver saver = ofy.save();
                    item.setOwner(parent);
                    if (item.getId() != null) {
                        Envie saved = ofy.load().key(Key.create(parent, Envie.class, item.getId())).now();
                        item.setUserTake(saved.getUserTake());
                    }
                    Key<Envie> key = saver.entity(item).now();
                    return item;
                }
            });
        }
        return null;
    }

    private static void removeUserTake(List<Envie> list) {
        for (Envie envie : list) {
            envie.setUserTake(null); //Si l'utilisateur courrant est le propriétaire des envies, on efface le nom de qui lui a offert un cadeau.
            envie.setNotes(null);
        }
    }
}