package fr.desaintsteban.liste.envies.service;

import com.googlecode.objectify.Key;
import com.googlecode.objectify.Work;
import com.googlecode.objectify.cmd.QueryKeys;
import com.googlecode.objectify.cmd.Saver;
import fr.desaintsteban.liste.envies.model.AppUser;
import fr.desaintsteban.liste.envies.model.ListEnvies;
import fr.desaintsteban.liste.envies.model.UserShare;
import fr.desaintsteban.liste.envies.model.UserShareType;
import fr.desaintsteban.liste.envies.util.StringUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

public final class ListEnviesService {
	private static final Logger LOGGER = Logger.getLogger(ListEnviesService.class.getName());

    private ListEnviesService() {}

	public static List<ListEnvies> list() {
		List<ListEnvies> list = OfyService.ofy().load().type(ListEnvies.class).list();
		return list;
	}

	public static List<ListEnvies> list(String email) {
		List<ListEnvies> list = OfyService.ofy().load().type(ListEnvies.class).filter("users.email =", email).list();
		return list;
	}

	public static Map<String, ListEnvies> loadAll(List<String> names) {
    	return OfyService.ofy().load().type(ListEnvies.class).ids(names);
	}

	public static void delete(String email) {
		OfyService.ofy().delete().key(Key.create(ListEnvies.class, email)).now();
	}

	public static ListEnvies get(String email) {
		return OfyService.ofy().load().key(Key.create(ListEnvies.class, email)).now();
	}

	public static ListEnvies createOrUpdate(final AppUser user, final ListEnvies item) {
		if (StringUtils.isNullOrEmpty(item.getTitle())) {
			String title = "Liste de " + user.getName();
			item.setTitle(title);
		}
		if (StringUtils.isNullOrEmpty(item.getName())) { // is add list
			String name = StringUtils.toValidIdName(item.getTitle());
			int i = 0;
			String prefix = name;
			while (OfyService.ofy().load().key(Key.create(ListEnvies.class, name)).now() != null) {
				name = prefix + '-' + i;
				i++;
			}
			item.setName(name);
		}

		final List<String> userToEmail = new ArrayList<>();
		for (UserShare userShare : item.getUsers()) {
			userToEmail.add(userShare.getEmail());
		}
		ListEnvies updateElement = OfyService.ofy().load().key(Key.create(ListEnvies.class, item.getName())).now();
		if (updateElement != null) { // Update
			for (UserShare oldUsers : updateElement.getUsers()) {
				userToEmail.remove(oldUsers.getEmail());
			}
		}
		return OfyService.ofy().transact(new Work<ListEnvies>() {
			@Override
			public ListEnvies run() {
				final Saver saver = OfyService.ofy().save();
				saver.entities(item).now();
				NotificationsService.notifyUserAddedToList(item, userToEmail, user);
				return item;
			}
		});
	}

	public static List<Key<ListEnvies>> userListKeys(String email) {
		QueryKeys<ListEnvies> keys = OfyService.ofy().load().type(ListEnvies.class)/*.filter("users.type =", UserShareType.SHARED)*/.filter("users.email =", email).keys()/*.list()*/;
		List<Key<ListEnvies>> list = new ArrayList<>();
		for (Key<ListEnvies> key : keys) {
			list.add(key);
		}
		return list;
	}
}
