package fr.desaintsteban.liste.envies.service;

import com.googlecode.objectify.Key;
import com.googlecode.objectify.cmd.Deleter;
import com.googlecode.objectify.cmd.QueryKeys;
import com.googlecode.objectify.cmd.Saver;
import fr.desaintsteban.liste.envies.enums.WishListStatus;
import fr.desaintsteban.liste.envies.exception.NotAcceptableException;
import fr.desaintsteban.liste.envies.exception.NotAllowedException;
import fr.desaintsteban.liste.envies.model.AppUser;
import fr.desaintsteban.liste.envies.model.UserShare;
import fr.desaintsteban.liste.envies.model.Wish;
import fr.desaintsteban.liste.envies.model.WishList;
import fr.desaintsteban.liste.envies.util.StringUtils;
import fr.desaintsteban.liste.envies.util.WishRules;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;
import java.util.stream.Collectors;

public final class WishListService {
	private static final Logger LOGGER = Logger.getLogger(WishListService.class.getName());

    private WishListService() {}

	public static List<WishList> list() {
		List<WishList> list = OfyService.ofy().load().type(WishList.class).list();
		return list;
	}

	public static List<WishList> list(String email) {
		List<WishList> list = OfyService.ofy().load().type(WishList.class).filter("users.email =", email).list(); // .filter("status != ",WishListStatus.ARCHIVED)
		return list;
	}

	public static Map<String, WishList> loadAll(List<String> names) {
    	return OfyService.ofy().load().type(WishList.class).ids(names);
	}

	public static void delete(String listName) {
		OfyService.ofy().delete().key(Key.create(WishList.class, listName)).now();
	}

	public static WishList get(String listName) {
		return OfyService.ofy().load().key(Key.create(WishList.class, listName)).now();
	}

	public static WishList getOrThrow(String listName) {
		return OfyService.ofy().load().key(Key.create(WishList.class, listName)).safe();
	}

	public static WishList createOrUpdate(final AppUser user, final WishList item) {
		if (!item.containsOwner(user.getEmail()) && !user.isAdmin()) {
			throw new NotAllowedException();
		}
		if (StringUtils.isNullOrEmpty(item.getTitle())) {
			String title = "Liste de " + user.getName();
			item.setTitle(title);
		}
		if (StringUtils.isNullOrEmpty(item.getName())) { // is add list
			String name = StringUtils.toValidIdName(item.getTitle());
			int i = 0;
			String prefix = name;
			while (OfyService.ofy().load().key(Key.create(WishList.class, name)).now() != null) {
				name = prefix + '-' + i;
				i++;
			}
			item.setName(name);
		}

		final List<String> userToEmail = item.getUsers().stream().map(UserShare::getEmail).collect(Collectors.toList());
		WishList updateElement = OfyService.ofy().load().key(Key.create(WishList.class, item.getName())).now();
		if (updateElement != null) { // Update
			// On vérifie que l'on a le droit de modifier la liste
			if (!updateElement.containsOwner(user.getEmail()) && !user.isAdmin()) {
				throw new NotAllowedException();
			}
			updateElement.getUsers().stream()
					.map(UserShare::getEmail)
					.filter(email -> email.equals(user.getEmail()))
					.forEach(userToEmail::remove);
			item.setCounts(updateElement.getCounts());
		}
		return OfyService.ofy().transact(() -> {
            final Saver saver = OfyService.ofy().save();
            saver.entities(item).now();
            NotificationsService.notifyUserAddedToList(item, userToEmail, user);
            return item;
        });
	}

	public static void addUser(AppUser user, WishList wishList) {
		wishList.addUser(user);
		OfyService.ofy().save().entity(wishList);
	}

	public static List<Key<WishList>> userListKeys(String email) {
		QueryKeys<WishList> keys = OfyService.ofy().load().type(WishList.class).filter("users.email =", email).keys();
		return keys.list();
	}

	public static void rename(AppUser user, String name, String newName) {
		Key<WishList> newKey = Key.create(WishList.class, newName);
		WishList newList = OfyService.ofy().load().key(newKey).now();
		if (newList != null)
			throw new NotAcceptableException("Already exist");
    	Key<WishList> key = Key.create(WishList.class, name);
		WishList list = OfyService.ofy().load().key(key).now();
		if (!list.containsOwner(user.getEmail()))
			throw new NotAllowedException();
		List<Wish> wishes = OfyService.ofy().load().type(Wish.class).ancestor(key).list();
		List<Key<Wish>> oldWishesKey = new ArrayList<>();
		list.setName(newName);
		wishes.forEach(wish ->  {
			oldWishesKey.add(Key.create(key, Wish.class, wish.getId()));
			wish.setList(newKey);
		});
		OfyService.ofy().transact(() -> {
			final Saver saver = OfyService.ofy().save();
			saver.entity(list);
			saver.entities(wishes);
			Deleter deleter = OfyService.ofy().delete();
			deleter.key(key);
			deleter.keys(oldWishesKey);
		});
	}


	public static void archive(AppUser user, String name) {
		Key<WishList> key = Key.create(WishList.class, name);
		WishList list = OfyService.ofy().load().key(key).now();
		if (!list.containsOwner(user.getEmail()))
			throw new NotAllowedException();
		List<Wish> wishes = OfyService.ofy().load().type(Wish.class).ancestor(key).list();
		list.setStatus(WishListStatus.ARCHIVED);
		wishes.forEach(wish -> wish.setArchived(true));
		OfyService.ofy().transact(() -> {
			final Saver saver = OfyService.ofy().save();
			saver.entity(list);
			saver.entities(wishes);
		});
	}
}
