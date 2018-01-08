package fr.desaintsteban.liste.envies.service;

import com.google.appengine.api.users.User;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.cmd.Saver;
import fr.desaintsteban.liste.envies.model.AppUser;
import fr.desaintsteban.liste.envies.util.NicknameUtils;

import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.Map;

public final class AppUserService {
    private AppUserService() {
    }

    public static AppUser getAppUser(User user) {
        Objectify ofy = OfyService.ofy();
        if (user == null) { //Not Logged
            return null;
        }
        AppUser appUser = ofy.load().type(AppUser.class).id(user.getEmail()).now();
        UserService userService = UserServiceFactory.getUserService();
        if (appUser == null) { // appUser wasn't in the datastore
            appUser = new AppUser(user.getEmail(), NicknameUtils.getNickname(user.getNickname()));
            appUser.setIsAdmin(userService.isUserAdmin());
            appUser.setNewUser(true);
            appUser.setLastNotification(new Date());
            ofy.save().entity(appUser).now();
        } else { // appUser is already in the datastore
            // update properties if they've changed
            if (!appUser.getEmail().equalsIgnoreCase(user.getEmail()) || userService.isUserAdmin() != appUser.getIsAdmin()) {
                appUser.setEmail(user.getEmail());
                appUser.setIsAdmin(userService.isUserAdmin());
                ofy.save().entity(appUser).now();
            }
        }
        appUser.setIsAdmin(userService.isUserAdmin()); //Allways override isAdmin
        return appUser;
    }

    public static List<AppUser> list() {
        List<AppUser> list = OfyService.ofy().load().type(AppUser.class).list();
        return list;
    }

    public static Map<String, AppUser> loadAll(Collection<String> emails) {
        return OfyService.ofy().load().type(AppUser.class).ids(emails);
    }

    public static void delete(String email) {
        OfyService.ofy().delete().key(Key.create(AppUser.class, email)).now();
    }

    public static AppUser get(String email) {
        return OfyService.ofy().load().key(Key.create(AppUser.class, email)).now();
    }

    public static AppUser createOrUpdate(final AppUser item) {
        return OfyService.ofy().transact(() -> {
            final Saver saver = OfyService.ofy().save();
            saver.entities(item).now();
            return item;
        });
    }
}
