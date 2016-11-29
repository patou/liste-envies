package fr.desaintsteban.liste.envies.service;

import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyFactory;
import com.googlecode.objectify.ObjectifyService;
import fr.desaintsteban.liste.envies.model.AppUser;
import fr.desaintsteban.liste.envies.model.Envie;

public final class OfyService {
    static {
    	factory().register(AppUser.class);
    	factory().register(Envie.class);
    }
    
    private OfyService() {}
    
    public static Objectify ofy() {
        return ObjectifyService.ofy();
    }
    
    public static ObjectifyFactory factory() {
        return ObjectifyService.factory();
    }
}
