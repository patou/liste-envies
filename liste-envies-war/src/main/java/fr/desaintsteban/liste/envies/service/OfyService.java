package fr.desaintsteban.liste.envies.service;

import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyFactory;
import com.googlecode.objectify.ObjectifyService;
import com.googlecode.objectify.util.Closeable;
import fr.desaintsteban.liste.envies.model.AppUser;
import fr.desaintsteban.liste.envies.model.Notification;
import fr.desaintsteban.liste.envies.model.Wish;
import fr.desaintsteban.liste.envies.model.WishList;
import fr.desaintsteban.liste.envies.model.deprecated.Envy;
import fr.desaintsteban.liste.envies.model.deprecated.ListEnvies;

public final class OfyService {
    static {
    	factory().register(AppUser.class);
        factory().register(Wish.class);
        factory().register(WishList.class);
        // todo delete when migrated
        factory().register(Envy.class);
        factory().register(ListEnvies.class);

        factory().register(Notification.class);
    }

    private OfyService() {}

    public static Objectify ofy() {
        return ObjectifyService.ofy();
    }

    public static ObjectifyFactory factory() {
        return ObjectifyService.factory();
    }

    public static Closeable begin() {
        return ObjectifyService.begin();
    }
}
