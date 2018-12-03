package fr.desaintsteban.liste.envies.service;

import com.googlecode.objectify.cmd.Query;
import com.googlecode.objectify.cmd.Saver;
import fr.desaintsteban.liste.envies.enums.NotificationType;
import fr.desaintsteban.liste.envies.enums.UserShareType;
import fr.desaintsteban.liste.envies.model.*;

import java.util.Date;
import java.util.List;

import static java.util.stream.Collectors.toList;

public final class NotificationsService {
    private NotificationsService() {}

	public static List<WishList> list() {
		List<WishList> list = OfyService.ofy().load().type(WishList.class).list();
		return list;
	}

	public static List<Notification> list(AppUser user) {
		Query<Notification> filter = OfyService.ofy().load().type(Notification.class).filter("user =", user.getEmail());
		if (user.getLastNotification() != null)
			filter = filter.filter("date >=",user.getLastNotification());
		List<Notification> list = filter.order("-date").limit(35).list();
		return list;
	}

	public static Notification notify(NotificationType type, final AppUser currentUser, WishList wishList, boolean noOwners) {
		return notify(type, currentUser, wishList, noOwners, "");
	}

	public static Notification notify(NotificationType type, final AppUser currentUser, final WishList wishList, boolean noOwners, final String message) {
		final Notification newNotif = new Notification();

		newNotif.setType(type);
		newNotif.setListId(wishList.getName());
		newNotif.setListName(wishList.getTitle());
		newNotif.setDate(new Date());
		newNotif.setMessage(message);
		newNotif.setActionUser(currentUser.getEmail());
		newNotif.setActionUserName(currentUser.getName());
		newNotif.setActionUserPicture(currentUser.getPicture());

		newNotif.setUser(wishList.getUsers().stream()
				.filter(userShare ->
						(userShare.getType() != UserShareType.OWNER || !noOwners)
								&& !userShare.getEmail().equals(currentUser.getEmail()))
				.map(UserShare::getEmail).collect(toList()));

		return OfyService.ofy().transact(() -> {
            final Saver saver = OfyService.ofy().save();
            saver.entities(newNotif).now();
            return newNotif;
        });
	}


	public static Notification notifyUserAddedToList(final WishList list, List<String> users, final AppUser currentUser) {
		final Notification newNotif = new Notification();
		newNotif.setType(NotificationType.ADD_USER);
		newNotif.setListId(list.getName());
		newNotif.setListName(list.getTitle());
		newNotif.setUser(users);
		newNotif.setDate(new Date());
		newNotif.setActionUser(currentUser.getEmail());
		newNotif.setActionUserName(currentUser.getName());
		newNotif.setActionUserPicture(currentUser.getPicture());
		return OfyService.ofy().transact(() -> {
            final Saver saver = OfyService.ofy().save();
            saver.entities(newNotif).now();
            //sendMailAddToList(newNotif, currentUser);
            return newNotif;
        });
	}

	/*
	public static boolean sendMailAddToList(Notification newNotif, AppUser currentUser) {
		Properties props = new Properties();
		Session session = Session.getDefaultInstance(props, null);

		try {
			String addedUser = newNotif.getAddedUserEmail();

			if (addedUser == null) return false;

			Message msg = new MimeMessage(session);
			msg.setFrom(new InternetAddress(currentUser.getEmail(), currentUser.getName()+ " - via list-envies"));

			msg.addRecipient(Message.RecipientType.TO,
					new InternetAddress(addedUser, addedUser));
			msg.setSubject("Viens découvrir ma liste d'envie");
			msg.setText("Bonjour, je t'ai ajouté à ma liste d'envie. viens la découvrir sur http://liste-envie.desaintsteban.fr/#/");
			Transport.send(msg);
			return true;
		} catch (AddressException e) {
			// ...
			return false;
		} catch (MessagingException e) {
			// ...
			return false;
		} catch (UnsupportedEncodingException e) {
			// ...
			return false;
		}
	}*/
}
