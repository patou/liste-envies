package fr.desaintsteban.liste.envies.service;

import com.googlecode.objectify.*;
import com.googlecode.objectify.cmd.Saver;
import fr.desaintsteban.liste.envies.dto.WishDto;
import fr.desaintsteban.liste.envies.dto.NoteDto;
import fr.desaintsteban.liste.envies.enums.NotificationType;
import fr.desaintsteban.liste.envies.model.*;
import fr.desaintsteban.liste.envies.util.EncodeUtils;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

public final class WishesService {
    private WishesService() {}
    
    public static List<Wish> list(AppUser user, String name) {
        Objectify ofy = OfyService.ofy();
        Key<WishList> key = Key.create(WishList.class, name);
        LoadResult<WishList> loadResult = ofy.load().key(key); //Chargement asynchrone
        List<Wish> list = ofy.load().type(Wish.class).ancestor(key).list();
        WishList wishList = loadResult.now();
        removeUserTake(user, wishList, list);
        return list;
    }

    public static List<Wish> archived(AppUser user) {
        Objectify ofy = OfyService.ofy();
        List<Wish> list = ofy.load().type(Wish.class).filter("userReceived =", user.getEmail()).list();
        return list;
    }

    public static List<Wish> gived(AppUser user) {
        Objectify ofy = OfyService.ofy();
        List<Wish> list = ofy.load().type(Wish.class).filter("userTake.email =", EncodeUtils.encode(user.getEmail())).list();
        return list;
    }

    public static List<Wish> listAll() {
        List<Wish> list = OfyService.ofy().load().type(Wish.class).list();
        //On supprime toujours celui qui a donner le cadeaux
        removeUserTake(null, null, list);
        return list;
    }

    public static List<Wish> list(AppUser user, String name, String libelle) {
        Objectify ofy = OfyService.ofy();
        Key<WishList> parent = Key.create(WishList.class, name);
        LoadResult<WishList> loadResult = ofy.load().key(parent); //Chargement asynchrone
        List<Wish> list = ofy.load().type(Wish.class).ancestor(parent).filter("label >=", libelle).filter("label <", libelle + "\uFFFD").list();
        WishList wishList = loadResult.now();
        removeUserTake(user, wishList, list);
        return list;
    }
    
    public static void delete(final AppUser user, final String name, final Long itemid) {
        Objectify ofy = OfyService.ofy();
        final Key<WishList> parent = Key.create(WishList.class, name);
        final WishList wishList = ofy.load().key(parent).now();
        OfyService.ofy().transact(new VoidWork() {
            @Override
            public void vrun() {
                Objectify ofy = OfyService.ofy();
                Wish saved = ofy.load().key(Key.create(parent, Wish.class, itemid)).now();
                if (saved.hasUserTaken() && wishList.containsOwner(saved.getOwner().getEmail())) {
                    Saver saver = ofy.save();
                    saved.setDeleted(true);
                    saver.entity(saved);
                    NotificationsService.notify(NotificationType.DELETE_WISH, user, wishList, true, saved.getLabel());
                }
                else {
                    ofy.delete().key(Key.create(parent, Wish.class, itemid)).now();
                }
            }
        });
    }

    public static void archive(final AppUser user, final String name, final Long itemid) {
        Objectify ofy = OfyService.ofy();
        final Key<WishList> parent = Key.create(WishList.class, name);
        final WishList wishList = ofy.load().key(parent).now();
        OfyService.ofy().transact(new VoidWork() {
            @Override
            public void vrun() {
                Objectify ofy = OfyService.ofy();
                Wish saved = ofy.load().key(Key.create(parent, Wish.class, itemid)).now();
                Saver saver = ofy.save();
                saved.setArchived(true);
                saved.setDeleted(false);
                saved.setUserReceived(wishList.getUsers()
                        .stream()
                        .filter(UserShare::isOwner)
                        .map(UserShare::getEmail)
                        .collect(Collectors.toList()));
                saver.entity(saved);

                NotificationsService.notify(NotificationType.ARCHIVE_WISH, user, wishList, true);

            }
        });
    }

    public static Wish get(AppUser user, String name, Long itemid) {
        Objectify ofy = OfyService.ofy();
        Key<WishList> parent = Key.create(WishList.class, name);
        LoadResult<WishList> loadResult = ofy.load().key(parent); //Chargement asynchrone
        Wish wish = OfyService.ofy().load().key(Key.create(parent, Wish.class, itemid)).now();
        WishList wishList = loadResult.now();
        if (wishList != null && wishList.containsOwner(user.getEmail())) {
            wish.setUserTake(null);
            wish.setNotes(null);
        }
        return wish;
    }


    public static WishDto given(final AppUser user, final String name, final Long itemId) {
        Objectify ofy = OfyService.ofy();
        final Key<WishList> parent = Key.create(WishList.class, name);
        final WishList wishList = ofy.load().key(parent).now();
        if (!wishList.containsOwner(user.getEmail()) && wishList.containsUser(user.getEmail())) {
            return OfyService.ofy().transact(new Work<WishDto>() {
                @Override
                public WishDto run() {
                    Objectify ofy = OfyService.ofy();
                    Wish saved = ofy.load().key(Key.create(parent, Wish.class, itemId)).now();
                    Saver saver = ofy.save();
                    PersonParticipant personParticipant = new PersonParticipant();
                    personParticipant.setEmail(EncodeUtils.encode(user.getEmail()));
                    personParticipant.setName(EncodeUtils.encode(user.getName()));
                    saved.addUserTake(personParticipant);
                    saver.entity(saved);
                    NotificationsService.notify(NotificationType.GIVEN_WISH, user, wishList, true, saved.getLabel());
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
    public static WishDto addNote(final AppUser user, final Long itemId, final String name, final NoteDto note) {
        Objectify ofy = OfyService.ofy();
        final Key<WishList> parent = Key.create(WishList.class, name);
        final WishList wishList = ofy.load().key(parent).now();
        if (wishList != null && !wishList.containsOwner(user.getEmail()) && wishList.containsUser(user.getEmail())) {
            return OfyService.ofy().transact(new Work<WishDto>() {
                @Override
                public WishDto run() {
                    Objectify ofy = OfyService.ofy();
                    Wish saved = ofy.load().key(Key.create(parent, Wish.class, itemId)).now();
                    Saver saver = ofy.save();

                    saved.addNote(Note.fromDto(note, true));
                    saver.entity(saved);

                    NotificationsService.notify(NotificationType.ADD_NOTE, user, wishList, true, note.getText());

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
    public static WishDto cancel(final AppUser user, String name, final Long itemId) {
        Objectify ofy = OfyService.ofy();
        final Key<WishList> parent = Key.create(WishList.class, name);
        WishList wishList = ofy.load().key(parent).now();
        if (wishList != null && !wishList.containsOwner(user.getEmail()) && wishList.containsUser(user.getEmail())) {
            return OfyService.ofy().transact(() -> {
            Objectify ofy1 = OfyService.ofy();
            Wish saved = ofy1.load().key(Key.create(parent, Wish.class, itemId)).now();
            Saver saver = ofy1.save();
            saved.removeUserTake(EncodeUtils.encode(user.getEmail()));
            saver.entity(saved);
                return saved.toDto();
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
    public static WishDto createOrUpdate(final AppUser user, final String name, final Wish item) {
        Objectify ofy = OfyService.ofy();
        final Key<WishList> parent = Key.create(WishList.class, name);
        final WishList wishList = ofy.load().key(parent).now();
        if (wishList != null) {
            return OfyService.ofy().transact(() -> {
            Objectify ofy1 = OfyService.ofy();
            Saver saver = ofy1.save();
            boolean add = true;
            item.setList(parent);
            if (item.getId() != null) {
                Wish saved = ofy1.load().key(Key.create(parent, Wish.class, item.getId())).now();
                item.setUserTake(saved.getUserTake());
                item.setNotes(saved.getNotes());
                item.setOwner(saved.getOwner());
                add = false;
            }
            if (item.getOwner() == null) {
                item.setOwner(new Person(user.getEmail(), user.getName()));
            }
            boolean containsOwner = wishList.containsOwner(item.getOwner().getEmail());
            item.setSuggest(!containsOwner);
            item.setDate(new Date());
            Key<Wish> key = saver.entity(item).now();

            NotificationsService.notify((add)? NotificationType.ADD_WISH : NotificationType.UPDATE_WISH, user, wishList, !containsOwner, item.getLabel());

            return item.toDto(containsOwner);
            });
        }
        return null;
    }

    /**
     * Permerttre de supprimer les infos sensibles à cacher au propriétaire par exemple.
     * @param user utilisateur courant
     * @param wishList La liste entière
     * @param list liste des envies.
     */
    private static void removeUserTake(AppUser user, WishList wishList, List<Wish> list) {
        List<Wish> toRemove = new ArrayList<>();
        //Liste globale
//Si l'utilisateur courant est le propriétaire des envies, on efface le nom de qui lui a offert un cadeau.
// On supprime les envies ajoutés par d'autres personnes
        list.forEach(envy -> {
            if (envy.getArchived()) {
                toRemove.add(envy);
            } else if (wishList == null || user == null) { //Liste globale
                envy.setUserTake(null);
                envy.setNotes(null);
            } else {
                if (wishList.containsOwner(user.getEmail())) { //Si l'utilisateur courant est le propriétaire des envies, on efface le nom de qui lui a offert un cadeau.
                    envy.setUserTake(null);
                    envy.setNotes(null);
                    if (envy.getSuggest() || envy.getDeleted()) { // On supprime les envies ajoutés par d'autres personnes
                        toRemove.add(envy);
                    }
                }
            }
        });
        list.removeAll(toRemove);
    }
}