package fr.desaintsteban.liste.envies.util;

import com.google.appengine.api.users.User;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import fr.desaintsteban.liste.envies.exception.NotLoggedException;
import fr.desaintsteban.liste.envies.model.AppUser;
import fr.desaintsteban.liste.envies.service.AppUserService;

import java.io.BufferedReader;
import java.io.IOException;

public final class ServletUtils {
	private ServletUtils() { }
    /**
     * Check si l'utilisateur est connecté
     * @return True si l'utilisateur est connecté
     */
    public static boolean isUserConnected() {
        return AppUserService.hasAppUser() || UserServiceFactory.getUserService().isUserLoggedIn();
    }

    /**
     * Retourne l'utilisateur connecté via le token jwt ou via le service UserService
     * @return Utilisateur connecté
     * @throws NotLoggedException si l'utilateur n'est pas connecté.
     */
    public static AppUser getUserConnected() {
		AppUser appUser = AppUserService.getAppUser();
		if (appUser == null) {
			final UserService userService = UserServiceFactory.getUserService();
			final User user = userService.getCurrentUser();
			if (user != null) {
				return AppUserService.getAppUser(user);
			}
			else {
				throw new NotLoggedException();
			}
		}
		return appUser;
	}
}
