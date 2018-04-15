package fr.desaintsteban.liste.envies.service;

import com.auth0.jwt.interfaces.Claim;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.google.api.client.json.Json;
import com.google.appengine.api.users.User;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import com.google.firebase.auth.FirebaseToken;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.cmd.Saver;
import fr.desaintsteban.liste.envies.model.AppUser;
import fr.desaintsteban.liste.envies.util.NicknameUtils;
import org.json.JSONObject;

import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.function.Consumer;
import java.util.function.Predicate;

public final class AppUserService {
    private AppUserService() {
    }

    static ThreadLocal<AppUser> appUserThreadLocal = new ThreadLocal<>();

    public static AppUser getAppUser(User user) {
        UserService userService = UserServiceFactory.getUserService();
        return getAppUser(user.getEmail(), newAppUser -> {         
            newAppUser.setEmail(user.getEmail());
            newAppUser.setName(NicknameUtils.getNickname(user.getNickname()));
            newAppUser.setIsAdmin(userService.isUserAdmin());
            newAppUser.setLoginProvider("appengine");
        }, appUser -> {
            return (!appUser.getEmail().equalsIgnoreCase(user.getEmail()) || userService.isUserAdmin() != appUser.getIsAdmin());
        });
    }

    public static AppUser getAppUser(FirebaseToken user) {
        return getAppUser(user.getEmail(), newAppUser -> {         
            newAppUser.setEmail(user.getEmail());
            newAppUser.setName(user.getName());
            newAppUser.setPicture(user.getPicture());
            newAppUser.setIsAdmin(false);
            newAppUser.setLoginProvider(user.getIssuer());
        }, appUser -> {
            return (!appUser.isAdmin() || !appUser.getEmail().equalsIgnoreCase(user.getEmail()) /*|| !appUser.getPicture() || !appUser.getPicture().equals(user.getPicture())*/);
        });
    }

    public static AppUser getAppUserFromJwt(DecodedJWT jwt) {
        Map<String, Claim> user = jwt.getClaims();


        return getAppUser(user.get("email").asString(), newAppUser -> {
            newAppUser.setEmail(user.get("email").asString());
            newAppUser.setName(user.get("name").asString());
            newAppUser.setPicture(user.get("picture").asString());
            newAppUser.setIsAdmin(false);
            newAppUser.setLoginProvider(user.get("iss").asString());
        }, appUser -> {
            return (!appUser.isAdmin() || !appUser.getEmail().equalsIgnoreCase(user.get("email").asString()) || appUser.getPicture() == null || (appUser.getPicture() != null && !appUser.getPicture().equals(user.get("picture").asString()) ) );
        });
    }

    public static AppUser getAppUserFromJwt(DecodedJWT jwt) {
        Map<String, Claim> user = jwt.getClaims();


        return getAppUser(user.get("email").asString(), newAppUser -> {
            newAppUser.setEmail(user.get("email").asString());
            newAppUser.setName(user.get("name").asString());
            newAppUser.setPicture(user.get("picture").asString());
            newAppUser.setIsAdmin(false);
            newAppUser.setLoginProvider(user.get("iss").asString());
        }, appUser -> {
            return (!appUser.isAdmin() || !appUser.getEmail().equalsIgnoreCase(user.get("email").asString()) || appUser.getPicture() == null || (appUser.getPicture() != null && !appUser.getPicture().equals(user.get("picture").asString()) ) );
        });
    }

    public static AppUser getAppUser(String email, Consumer<AppUser> fillAppUser, Predicate<AppUser> checkAppUser) {
        Objectify ofy = OfyService.ofy();
        if (email == null) { //Not Logged
            return null;
        }
        AppUser appUser = ofy.load().type(AppUser.class).id(email).now();
        UserService userService = UserServiceFactory.getUserService();
        if (appUser == null) { // appUser wasn't in the datastore
            appUser = new AppUser(email);
            fillAppUser.accept(appUser);
            appUser.setNewUser(true);
            appUser.setLastNotification(new Date());
            ofy.save().entity(appUser).now();
        } else { // appUser is already in the datastore
            // update properties if they've changed
            if (!checkAppUser.test(appUser)) {
                fillAppUser.accept(appUser);
                ofy.save().entity(appUser).now();
            }
        }
        // Todo no userSService appUser.setIsAdmin(userService.isUserAdmin()); //Allways override isAdmin
        appUserThreadLocal.set(appUser);
        return appUser;
    }

    public static AppUser getAppUser() {
        return appUserThreadLocal.get();
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
