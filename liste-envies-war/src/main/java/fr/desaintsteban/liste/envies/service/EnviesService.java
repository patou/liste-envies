package fr.desaintsteban.liste.envies.service;

import com.googlecode.objectify.Key;
import com.googlecode.objectify.LoadResult;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.VoidWork;
import com.googlecode.objectify.Work;
import com.googlecode.objectify.cmd.Saver;
import fr.desaintsteban.liste.envies.dto.EnvyDto;
import fr.desaintsteban.liste.envies.dto.NoteDto;
import fr.desaintsteban.liste.envies.model.*;
import fr.desaintsteban.liste.envies.util.EncodeUtils;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public final class EnviesService {
    private EnviesService() {}
    
    public static List<Envy> list(AppUser user, String name) {
        Objectify ofy = OfyService.ofy();
        Key<ListEnvies> key = Key.create(ListEnvies.class, name);
        LoadResult<ListEnvies> loadResult = ofy.load().key(key); //Chargement asynchrone
        List<Envy> list = ofy.load().type(Envy.class).ancestor(key).list();
        ListEnvies listEnvies = loadResult.now();
        removeUserTake(user, listEnvies, list);
        return list;
    }

    public static List<Envy> listAll() {
        List<Envy> list = OfyService.ofy().load().type(Envy.class).list();
        //On supprime toujours celui qui a donner le cadeaux
        removeUserTake(null, null, list);
        return list;
    }

    public static List<Envy> list(AppUser user, String name, String libelle) {
        Objectify ofy = OfyService.ofy();
        Key<ListEnvies> parent = Key.create(ListEnvies.class, name);
        LoadResult<ListEnvies> loadResult = ofy.load().key(parent); //Chargement asynchrone
        List<Envy> list = ofy.load().type(Envy.class).ancestor(parent).filter("label >=", libelle).filter("label <", libelle + "\uFFFD").list();
        ListEnvies listEnvies = loadResult.now();
        removeUserTake(user, listEnvies, list);
        return list;
    }
    
    public static void delete(AppUser user, String name, final Long itemid) {
        Objectify ofy = OfyService.ofy();
        final Key<ListEnvies> parent = Key.create(ListEnvies.class, name);
        final ListEnvies listEnvies = ofy.load().key(parent).now();
        OfyService.ofy().transact(new VoidWork() {
            @Override
            public void vrun() {
                Objectify ofy = OfyService.ofy();
                Envy saved = ofy.load().key(Key.create(parent, Envy.class, itemid)).now();
                if (saved.hasUserTaken() && listEnvies.containsOwner(saved.getOwner())) {
                    Saver saver = ofy.save();
                    saved.setSuggest(true);
                    saver.entity(saved);
                }
                else {
                    ofy.delete().key(Key.create(parent, Envie.class, itemid)).now();
                }
            }
        });
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
                    saved.addUserTake(EncodeUtils.encode(user.getEmail()));
                    saver.entity(saved);
                }
            });
        }
    }

    public static EnvyDto addNote(final AppUser user, final Long itemId, final String name, final NoteDto note) {
        Objectify ofy = OfyService.ofy();
        final Key<ListEnvies> parent = Key.create(ListEnvies.class, name);
        ListEnvies listEnvies = ofy.load().key(parent).now();
        if (listEnvies != null && !listEnvies.containsOwner(user.getEmail()) && listEnvies.containsUser(user.getEmail())) {
            return OfyService.ofy().transact(new Work<EnvyDto>() {
                @Override
                public EnvyDto run() {
                    Objectify ofy = OfyService.ofy();
                    Envy saved = ofy.load().key(Key.create(parent, Envy.class, itemId)).now();
                    Saver saver = ofy.save();
                    saved.addNote(user.getName(), user.getEmail(), note.getText());
                    saver.entity(saved);

                    return saved.toDto();
                }
            });
        }
        return null;
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
                saved.removeUserTake(EncodeUtils.encode(user.getEmail()));
                saver.entity(saved);
                }
            });
        }
    }
    
    public static EnvyDto createOrUpdate(final AppUser user, final String name, final Envy item) {
        Objectify ofy = OfyService.ofy();
        final Key<ListEnvies> parent = Key.create(ListEnvies.class, name);
        final ListEnvies listEnvies = ofy.load().key(parent).now();
        if (listEnvies != null) {
            return OfyService.ofy().transact(new Work<EnvyDto>() {
                @Override
                public EnvyDto run() {
                Objectify ofy = OfyService.ofy();
                Saver saver = ofy.save();
                item.setList(parent);
                if (item.getId() != null) {
                    Envy saved = ofy.load().key(Key.create(parent, Envy.class, item.getId())).now();
                    item.setUserTake(saved.getUserTake());
                    item.setNotes(saved.getNotes());
                    item.setOwner(saved.getOwner());
                }
                if (item.getOwner() == null) {
                    item.setOwner(user.getEmail());
                }
                item.setSuggest(!listEnvies.containsOwner(item.getOwner()));
                item.setDate(new Date());
                Key<Envy> key = saver.entity(item).now();
                return item.toDto();
                }
            });
        }
        return null;
    }

    private static void removeUserTake(AppUser user, ListEnvies listEnvies, List<Envy> list) {
        List<Envy> toRemove = new ArrayList<>();
        for (Envy envy : list) {
            if (listEnvies == null  || user == null) { //Liste globale
                envy.setUserTake(null);
                envy.setNotes(null);
            }
            else {
                if (listEnvies.containsOwner(user.getEmail())) { //Si l'utilisateur courant est le propriétaire des envies, on efface le nom de qui lui a offert un cadeau.
                    envy.setUserTake(null);
                    envy.setNotes(null);
                    if (envy.getSuggest()) { // On supprime les envies ajoutés par d'autres personnes
                        toRemove.add(envy);
                    }
                }
            }
        }
        list.removeAll(toRemove);
    }
}