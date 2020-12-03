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

	private static final Gson gson = new Gson();
	private static final Gson customGson = new GsonBuilder().excludeFieldsWithoutExposeAnnotation().create();

	public static String toJson(Object o) {
		return gson.toJson(o);
	}

	public static String toCustomJson(Object o) {
		return customGson.toJson(o);
	}

	public static <T> T fromJson(String json, Class<T> clazz) {
		return gson.fromJson(json, clazz);
	}

	public static <T> T fromCustomJson(String json, Class<T> clazz) {
		return customGson.fromJson(json, clazz);
	}

	private static String getString(BufferedReader reader) throws IOException {
		StringBuilder sb = new StringBuilder();
		try {
	    	String line = reader.readLine();
	    	if (line != null) {
	    		sb.append(line);
		    	while ((line = reader.readLine()) != null)
		    		sb.append('\n').append(line);
	    	}
	    }
		finally {
	        reader.close();
	    }
		return sb.toString();
	}

	public static <T> T fromJson(BufferedReader reader, Class<T> clazz) throws IOException {
	    return fromJson(getString(reader), clazz);
	}

	public static <T> T fromCustomJson(BufferedReader reader, Class<T> clazz) throws IOException {
	    return fromCustomJson(getString(reader), clazz);
	}

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
