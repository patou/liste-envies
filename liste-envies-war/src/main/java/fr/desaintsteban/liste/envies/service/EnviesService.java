package fr.desaintsteban.liste.envies.service;

import com.googlecode.objectify.Key;
import com.googlecode.objectify.LoadResult;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.VoidWork;
import com.googlecode.objectify.Work;
import com.googlecode.objectify.cmd.Saver;
import fr.desaintsteban.liste.envies.dto.NoteDto;
import fr.desaintsteban.liste.envies.model.AppUser;
import fr.desaintsteban.liste.envies.model.Envie;
import fr.desaintsteban.liste.envies.model.Envy;
import fr.desaintsteban.liste.envies.model.ListEnvies;
import fr.desaintsteban.liste.envies.util.EncodeUtils;

import java.util.List;

public final class EnviesService {
    private EnviesService() {}
    
    public static List<Envy> list(AppUser user, String name) {
        Objectify ofy = OfyService.ofy();
        Key<ListEnvies> key = Key.create(ListEnvies.class, name);
        LoadResult<ListEnvies> loadResult = ofy.load().key(key); //Chargement asynchrone
        List<Envy> list = ofy.load().type(Envy.class).ancestor(key).list();
        ListEnvies listEnvies = loadResult.now();
        if (listEnvies != null && listEnvies.containsOwner(user.getEmail())) {
            removeUserTake(list);
        }
        return list;
    }

    public static List<Envy> listAll() {
        List<Envy> list = OfyService.ofy().load().type(Envy.class).list();
        //On supprime toujours celui qui a donner le cadeaux
        removeUserTake(list);
        return list;
    }

    public static List<Envy> list(AppUser user, String name, String libelle) {
        Objectify ofy = OfyService.ofy();
        Key<ListEnvies> parent = Key.create(ListEnvies.class, name);
        LoadResult<ListEnvies> loadResult = ofy.load().key(parent); //Chargement asynchrone
        List<Envy> list = ofy.load().type(Envy.class).ancestor(parent).filter("label >=", libelle).filter("label <", libelle + "\uFFFD").list();
        ListEnvies listEnvies = loadResult.now();
        if (listEnvies != null && listEnvies.containsOwner(user.getEmail())) {
            removeUserTake(list);
        }
        return list;
    }
    
    public static void delete(AppUser user, String name, Long itemid) {
        Objectify ofy = OfyService.ofy();
        Key<ListEnvies> parent = Key.create(ListEnvies.class, name);
        ListEnvies listEnvies = ofy.load().key(parent).now();
        if (listEnvies.containsOwner(user.getEmail()) || user.isAdmin()) {
            OfyService.ofy().delete().key(Key.create(parent, Envie.class, itemid)).now();
        }
    }

    public static Envy get(AppUser user, String name, Long itemid) {
        Objectify ofy = OfyService.ofy();
        Key<ListEnvies> parent = Key.create(ListEnvies.class, name);
        LoadResult<ListEnvies> loadResult = ofy.load().key(parent); //Chargement asynchrone
        Envy envie = OfyService.ofy().load().key(Key.create(parent, Envy.class, itemid)).now();
        ListEnvies listEnvies = loadResult.now();
        if (listEnvies != null && listEnvies.containsOwner(user.getEmail())) {
            envie.setUserTake(null);
            envie.setNotes(null);
        }
        return envie;
    }

    public static void given(final AppUser user, String name, final Long itemId) {
        Objectify ofy = OfyService.ofy();
        final Key<ListEnvies> parent = Key.create(ListEnvies.class, name);
        ListEnvies listEnvies = ofy.load().key(parent).now();
        if (!listEnvies.containsOwner(user.getEmail()) && listEnvies.containsUser(user.getEmail())) {
            OfyService.ofy().transact(new VoidWork() {
                @Override
                public void vrun() {
                    Objectify ofy = OfyService.ofy();
                    Envy saved = ofy.load().key(Key.create(parent, Envy.class, itemId)).now();
                    Saver saver = ofy.save();
                    saved.setUserTake(EncodeUtils.encode(user.getEmail()));
                    saver.entity(saved);
                }
            });
        }
    }

    public static void addNote(final AppUser user, final Long itemId, final String name, final NoteDto note) {
        Objectify ofy = OfyService.ofy();
        final Key<ListEnvies> parent = Key.create(ListEnvies.class, name);
        ListEnvies listEnvies = ofy.load().key(parent).now();
        if (listEnvies != null && !listEnvies.containsOwner(user.getEmail()) && listEnvies.containsUser(user.getEmail())) {
            OfyService.ofy().transact(new VoidWork() {
                @Override
                public void vrun() {
                    Objectify ofy = OfyService.ofy();
                    Envy saved = ofy.load().key(Key.create(parent, Envy.class, itemId)).now();
                    Saver saver = ofy.save();
                    saved.addNote(user.getName(), user.getEmail(), note.getText());
                    saver.entity(saved);
                }
            });
        }
    }

    public static void cancel(final AppUser user, String name,  final Long itemId) {
        Objectify ofy = OfyService.ofy();
        final Key<ListEnvies> parent = Key.create(ListEnvies.class, name);
        ListEnvies listEnvies = ofy.load().key(parent).now();
        if (listEnvies != null && !listEnvies.containsOwner(user.getEmail()) && listEnvies.containsUser(user.getEmail())) {
            OfyService.ofy().transact(new VoidWork() {
                @Override
                public void vrun() {
                    Objectify ofy = OfyService.ofy();
                    Envy saved = ofy.load().key(Key.create(parent, Envy.class, itemId)).now();
                    Saver saver = ofy.save();
                    saved.setUserTake(null);
                    saver.entity(saved);
                }
            });
        }
    }
    
    public static Envy createOrUpdate(final AppUser user, final String name, final Envy item) {
        Objectify ofy = OfyService.ofy();
        final Key<ListEnvies> parent = Key.create(ListEnvies.class, name);
        ListEnvies listEnvies = ofy.load().key(parent).now();
        if (listEnvies != null && listEnvies.containsOwner(user.getEmail())) {
            return OfyService.ofy().transact(new Work<Envy>() {
                @Override
                public Envy run() {
                    Objectify ofy = OfyService.ofy();
                    Saver saver = ofy.save();
                    item.setList(parent);
                    if (item.getId() != null) {
                        Envy saved = ofy.load().key(Key.create(parent, Envy.class, item.getId())).now();
                        item.setUserTake(saved.getUserTake());
                        item.setNotes(saved.getNotes());
                    }
                    Key<Envy> key = saver.entity(item).now();
                    return item;
                }
            });
        }
        return null;
    }

    private static void removeUserTake(List<Envy> list) {
        for (Envy envy : list) {
            envy.setUserTake(null); //Si l'utilisateur courrant est le propriétaire des envies, on efface le nom de qui lui a offert un cadeau.
            envy.setNotes(null);
        }
    }
}