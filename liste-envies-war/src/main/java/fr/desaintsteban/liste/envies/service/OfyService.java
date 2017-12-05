package fr.desaintsteban.liste.envies.service;

import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyFactory;
import com.googlecode.objectify.ObjectifyService;
import com.googlecode.objectify.util.Closeable;
import fr.desaintsteban.liste.envies.model.*;

public final class OfyService {
    static {
    	factory().register(AppUser.class);
        factory().register(Envy.class);
        factory().register(WishList.class);
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
