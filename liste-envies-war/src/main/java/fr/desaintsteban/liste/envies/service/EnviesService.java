package fr.desaintsteban.liste.envies.service;

import com.googlecode.objectify.*;
import com.googlecode.objectify.cmd.Saver;
import fr.desaintsteban.liste.envies.dto.EnvyDto;
import fr.desaintsteban.liste.envies.dto.NoteDto;
import fr.desaintsteban.liste.envies.model.AppUser;
import fr.desaintsteban.liste.envies.model.Envy;
import fr.desaintsteban.liste.envies.model.ListEnvies;
import fr.desaintsteban.liste.envies.model.NotificationType;
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
    
    public static void delete(final AppUser user, final String name, final Long itemid) {
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
                    saved.setDeleted(true);
                    saver.entity(saved);
                    NotificationsService.notify(NotificationType.DELETE_WISH, user, listEnvies, true, saved.getLabel());
                }
                else {
                    ofy.delete().key(Key.create(parent, Envy.class, itemid)).now();
                }
            }
        });
    }

    public static void archive(final AppUser user, final String name, final Long itemid) {
        Objectify ofy = OfyService.ofy();
        final Key<ListEnvies> parent = Key.create(ListEnvies.class, name);
        final ListEnvies listEnvies = ofy.load().key(parent).now();
        OfyService.ofy().transact(new VoidWork() {
            @Override
            public void vrun() {
                Objectify ofy = OfyService.ofy();
                Envy saved = ofy.load().key(Key.create(parent, Envy.class, itemid)).now();
                Saver saver = ofy.save();
                saved.setArchived(true);
                saved.setDeleted(false);
                saver.entity(saved);

                NotificationsService.notify(NotificationType.ARCHIVE_WISH, user, listEnvies, true);

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


    public static EnvyDto given(final AppUser user, final String name, final Long itemId) {
        Objectify ofy = OfyService.ofy();
        final Key<ListEnvies> parent = Key.create(ListEnvies.class, name);
        final ListEnvies listEnvies = ofy.load().key(parent).now();
        if (!listEnvies.containsOwner(user.getEmail()) && listEnvies.containsUser(user.getEmail())) {
            return OfyService.ofy().transact(new Work<EnvyDto>() {
                @Override
                public EnvyDto run() {
                    Objectify ofy = OfyService.ofy();
                    Envy saved = ofy.load().key(Key.create(parent, Envy.class, itemId)).now();
                    Saver saver = ofy.save();
                    saved.addUserTake(EncodeUtils.encode(user.getEmail()));
                    saver.entity(saved);
                    NotificationsService.notify(NotificationType.GIVEN_WISH, user, listEnvies, true, saved.getLabel());
                    return saved.toDto();
                }
            });
        }
        return null;
    }

    /**
     * Ajouter un commentaire
     * @param user user qui ajoute le commentaire
     * @param itemId id de l'envy
     * @param name nom de la liste
     * @param note le commentaire
     * @return
     */
    public static EnvyDto addNote(final AppUser user, final Long itemId, final String name, final NoteDto note) {
        Objectify ofy = OfyService.ofy();
        final Key<ListEnvies> parent = Key.create(ListEnvies.class, name);
        final ListEnvies listEnvies = ofy.load().key(parent).now();
        if (listEnvies != null && !listEnvies.containsOwner(user.getEmail()) && listEnvies.containsUser(user.getEmail())) {
            return OfyService.ofy().transact(new Work<EnvyDto>() {
                @Override
                public EnvyDto run() {
                    Objectify ofy = OfyService.ofy();
                    Envy saved = ofy.load().key(Key.create(parent, Envy.class, itemId)).now();
                    Saver saver = ofy.save();
                    saved.addNote(user.getName(), user.getEmail(), note.getText());
                    saver.entity(saved);

                    NotificationsService.notify(NotificationType.ADD_NOTE, user, listEnvies, true, note.getText());

                    return saved.toDto();
                }
            });
        }
        return null;
    }

    /**
     * Annuler le fait de donner un cadeau.
     *
     * @param user current user
     * @param name nom de la liste
     * @param itemId wish id.
     * @return l'envy modifié.
     */
    public static EnvyDto cancel(final AppUser user, String name, final Long itemId) {
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
                saved.removeUserTake(EncodeUtils.encode(user.getEmail()));
                saver.entity(saved);
                    return saved.toDto();
                }
            });
        }
        return null;
    }

    /**
     * Créer ou mettre à jour une envie
     * @param user l'utilisateur qui as fait la modification
     * @param name le nom de la liste
     * @param item l'envy a ajouter ou modifier
     * @return l'envy modifié.
     */
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
                boolean add = true;
                item.setList(parent);
                if (item.getId() != null) {
                    Envy saved = ofy.load().key(Key.create(parent, Envy.class, item.getId())).now();
                    item.setUserTake(saved.getUserTake());
                    item.setNotes(saved.getNotes());
                    item.setOwner(saved.getOwner());
                    add = false;
                }
                if (item.getOwner() == null) {
                    item.setOwner(user.getEmail());
                }
                boolean containsOwner = listEnvies.containsOwner(item.getOwner());
                item.setSuggest(!containsOwner);
                item.setDate(new Date());
                Key<Envy> key = saver.entity(item).now();

                NotificationsService.notify((add)? NotificationType.ADD_WISH : NotificationType.UPDATE_WISH, user, listEnvies, !containsOwner, item.getLabel());

                return item.toDto(containsOwner);
                }
            });
        }
        return null;
    }

    /**
     * Permerttre de supprimer les infos sensibles à cacher au propriétaire par exemple.
     * @param user utilisateur courant
     * @param listEnvies La liste entière
     * @param list liste des envies.
     */
    private static void removeUserTake(AppUser user, ListEnvies listEnvies, List<Envy> list) {
        List<Envy> toRemove = new ArrayList<>();
        for (Envy envy : list) {
            if (envy.getArchived()) {
                toRemove.add(envy);
            }
            else if (listEnvies == null  || user == null) { //Liste globale
                envy.setUserTake(null);
                envy.setNotes(null);
            }
            else {
                if (listEnvies.containsOwner(user.getEmail())) { //Si l'utilisateur courant est le propriétaire des envies, on efface le nom de qui lui a offert un cadeau.
                    envy.setUserTake(null);
                    envy.setNotes(null);
                    if (envy.getSuggest() || envy.getDeleted()) { // On supprime les envies ajoutés par d'autres personnes
                        toRemove.add(envy);
                    }
                }
            }
        }
        list.removeAll(toRemove);
    }
}