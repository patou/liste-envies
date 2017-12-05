package fr.desaintsteban.liste.envies.service;

import com.googlecode.objectify.Key;
import com.googlecode.objectify.cmd.QueryKeys;
import com.googlecode.objectify.cmd.Saver;
import fr.desaintsteban.liste.envies.model.AppUser;
import fr.desaintsteban.liste.envies.model.WishList;
import fr.desaintsteban.liste.envies.model.UserShare;
import fr.desaintsteban.liste.envies.util.StringUtils;

import java.util.List;
import java.util.Map;
import java.util.logging.Logger;
import java.util.stream.Collectors;

public final class ListEnviesService {
	private static final Logger LOGGER = Logger.getLogger(ListEnviesService.class.getName());

    private ListEnviesService() {}

	public static List<WishList> list() {
		List<WishList> list = OfyService.ofy().load().type(WishList.class).list();
		return list;
	}

	public static List<WishList> list(String email) {
		List<WishList> list = OfyService.ofy().load().type(WishList.class).filter("users.email =", email).list();
		return list;
	}

	public static Map<String, WishList> loadAll(List<String> names) {
    	return OfyService.ofy().load().type(WishList.class).ids(names);
	}

	public static void delete(String email) {
		OfyService.ofy().delete().key(Key.create(WishList.class, email)).now();
	}

	public static WishList get(String email) {
		return OfyService.ofy().load().key(Key.create(WishList.class, email)).now();
	}

	public static WishList createOrUpdate(final AppUser user, final WishList item) {
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
			updateElement.getUsers().stream()
					.map(UserShare::getEmail)
					.filter(email -> email.equals(user.getEmail()))
					.forEach(userToEmail::remove);
		}
		return OfyService.ofy().transact(() -> {
            final Saver saver = OfyService.ofy().save();
            saver.entities(item).now();
            NotificationsService.notifyUserAddedToList(item, userToEmail, user);
            return item;
        });
	}

	public static List<Key<WishList>> userListKeys(String email) {
		QueryKeys<WishList> keys = OfyService.ofy().load().type(WishList.class)/*.filter("users.type =", UserShareType.SHARED)*/.filter("users.email =", email).keys()/*.list()*/;
		return keys.list();
	}
}
