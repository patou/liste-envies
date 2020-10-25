package fr.desaintsteban.liste.envies.service;

import com.googlecode.objectify.Key;
import com.googlecode.objectify.LoadResult;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.VoidWork;
import com.googlecode.objectify.Work;
import com.googlecode.objectify.cmd.Saver;
import fr.desaintsteban.liste.envies.dto.CommentDto;
import fr.desaintsteban.liste.envies.dto.WishDto;
import fr.desaintsteban.liste.envies.enums.NotificationType;
import fr.desaintsteban.liste.envies.enums.WishState;
import fr.desaintsteban.liste.envies.model.AppUser;
import fr.desaintsteban.liste.envies.model.Comment;
import fr.desaintsteban.liste.envies.model.Person;
import fr.desaintsteban.liste.envies.model.PersonParticipant;
import fr.desaintsteban.liste.envies.model.UserShare;
import fr.desaintsteban.liste.envies.model.Wish;
import fr.desaintsteban.liste.envies.model.WishList;
import fr.desaintsteban.liste.envies.util.EncodeUtils;
import fr.desaintsteban.liste.envies.util.WishRules;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

public final class WishesService {
    private WishesService() {}

    public static List<WishDto> list(AppUser user, String name) {
        return WishesService.list(user, name, false);
    }

    @Deprecated
    public static List<WishDto> list(AppUser user, String name, Boolean archive) {
        return list(user, name, archive ? WishState.ARCHIVED : WishState.ACTIVE);
    }

    public static List<WishDto> list(AppUser user, String name, WishState ...states) {
        Objectify ofy = OfyService.ofy();
        Key<WishList> key = Key.create(WishList.class, name);
        LoadResult<WishList> loadResult = ofy.load().key(key); //Chargement asynchrone
        List<Wish> list = ofy.load().type(Wish.class).ancestor(key).filter("state IN",states).list();
        WishList wishList = loadResult.now();
        return WishRules.applyRules(user, wishList, list);
    }

    public static List<WishDto> listArchived(AppUser user, String name) {
        return list(user, name, WishState.ARCHIVED);
    }

    public static List<WishDto> archived(AppUser user) {
        Objectify ofy = OfyService.ofy();
        List<Wish> list = ofy.load().type(Wish.class).filter("userReceived =", user.getEmail()).list();
        return WishRules.applyRules(user, null, list);
    }

    public static List<WishDto> given(AppUser user) {
        Objectify ofy = OfyService.ofy();
        List<Wish> list = ofy.load().type(Wish.class).filter("userTake.email =", EncodeUtils.encode(user.getEmail())).filter("state =", WishState.ACTIVE).list();
        return WishRules.applyRules(user, null, list);
    }

    public static List<WishDto> listAll() {
        List<Wish> list = OfyService.ofy().load().type(Wish.class).list();
        //On supprime toujours celui qui a donner le cadeaux
        return WishRules.applyRules(null, null, list);
    }

    public static List<WishDto> list(AppUser user, String name, String libelle) {
        Objectify ofy = OfyService.ofy();
        Key<WishList> parent = Key.create(WishList.class, name);
        LoadResult<WishList> loadResult = ofy.load().key(parent); //Chargement asynchrone
        List<Wish> list = ofy.load().type(Wish.class).ancestor(parent).filter("label >=", libelle).filter("label <", libelle + "\uFFFD").list();
        WishList wishList = loadResult.now();
        return WishRules.applyRules(user, wishList, list);
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
                Saver saver = ofy.save();
                if (saved.hasUserTaken() && wishList.containsOwner(saved.getOwner().getEmail())) {
                    wishList.changeCountsCount(saved.getState(), WishState.DELETED);
                    saved.setState(WishState.DELETED);
                    saved.setStateDate(new Date());
                    saver.entity(saved);
                    saver.entity(wishList);
                    NotificationsService.notify(NotificationType.DELETE_WISH, user, wishList, true, saved.getLabel());
                }
                else {
                    wishList.decrCounts(saved.getState());
                    saver.entity(wishList);
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
                wishList.changeCountsCount(saved.getState(), WishState.ARCHIVED);
                saved.setState(WishState.ARCHIVED);
                saved.setStateDate(new Date());
                saved.setUserReceived(wishList.getUsers()
                        .stream()
                        .filter(UserShare::isOwner)
                        .map(UserShare::getEmail)
                        .collect(Collectors.toList()));
                saver.entity(saved);
                saver.entity(wishList);

                NotificationsService.notify(NotificationType.ARCHIVE_WISH, user, wishList, true);

            }
        });
    }

    public static WishDto get(AppUser user, String name, Long itemid) {
        Objectify ofy = OfyService.ofy();
        Key<WishList> parent = Key.create(WishList.class, name);
        LoadResult<WishList> loadResult = ofy.load().key(parent); //Chargement asynchrone
        Wish wish = OfyService.ofy().load().key(Key.create(parent, Wish.class, itemid)).now();
        WishList wishList = loadResult.now();
        return WishRules.applyRules(user, wishList, wish);
    }


    public static WishDto give(final AppUser user, final String name, final Long itemId) {
        Objectify ofy = OfyService.ofy();
        final Key<WishList> parent = Key.create(WishList.class, name);
        final WishList wishList = ofy.load().key(parent).now();
        if (WishRules.canGive(wishList, user)) {
            return OfyService.ofy().transact(new Work<WishDto>() {
                @Override
                public WishDto run() {
                    Objectify ofy = OfyService.ofy();
                    Wish saved = ofy.load().key(Key.create(parent, Wish.class, itemId)).now();
                    Saver saver = ofy.save();
                    PersonParticipant personParticipant = new PersonParticipant();
                    personParticipant.setEmail(user.getEmail());
                    personParticipant.setName(user.getName());
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
     * @param comment le commentaire
     * @return
     */
    public static WishDto addComment(final AppUser user, final Long itemId, final String name, final CommentDto comment) {
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

                    Comment commentToAdd = Comment.fromDto(comment, true);
                    commentToAdd.setFrom(new Person(user, true));
                    saved.addComment(commentToAdd);
                    saver.entity(saved);

                    NotificationsService.notify(NotificationType.ADD_NOTE, user, wishList, true, comment.getText());

                    return WishRules.applyRules(user, wishList, saved);
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
        if (WishRules.canGive(wishList, user)) {
            return OfyService.ofy().transact(() -> {
            Objectify ofy1 = OfyService.ofy();
            Wish saved = ofy1.load().key(Key.create(parent, Wish.class, itemId)).now();
            Saver saver = ofy1.save();
            saved.removeUserTake(user.getEmail());
            saver.entity(saved);
                return WishRules.applyRules(user, wishList, saved);
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
                item.setComments(saved.getComments());
                item.setOwner(saved.getOwner());
                if (saved.getState() != item.getState()) {
                    wishList.changeCountsCount(saved.getState(), item.getState());
                    item.setStateDate(new Date());
                    saver.entity(wishList);
                }
                add = false;
            }
            else {
                wishList.incrCounts(item.getState());
                item.setStateDate(new Date());
                saver.entity(wishList);
            }
            if (item.getOwner() == null) {
                item.setOwner(new Person(user, false));
            }
            boolean containsOwner = wishList.containsOwner(item.getOwner().getEmail());
            item.setSuggest(!containsOwner);
            item.setDate(new Date());
            Key<Wish> key = saver.entity(item).now();

            NotificationsService.notify((add)? NotificationType.ADD_WISH : NotificationType.UPDATE_WISH, user, wishList, !containsOwner, item.getLabel());

                //return item.toDto(containsOwner);
                return WishRules.applyRules(user, wishList, item);
            });
        }
        return null;
    }
}
