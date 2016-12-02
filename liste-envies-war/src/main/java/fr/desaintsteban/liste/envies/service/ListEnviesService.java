package fr.desaintsteban.liste.envies.service;

import com.googlecode.objectify.Key;
import com.googlecode.objectify.Work;
import com.googlecode.objectify.cmd.Saver;
import fr.desaintsteban.liste.envies.model.ListEnvies;

import java.util.List;
import java.util.Map;

public final class ListEnviesService {
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

	public static ListEnvies createOrUpdate(final ListEnvies item) {
		return OfyService.ofy().transact(new Work<ListEnvies>() {
			@Override
			public ListEnvies run() {
				final Saver saver = OfyService.ofy().save();
				saver.entities(item).now();
				return item;
			}
		});
	}
}
