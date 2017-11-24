package fr.desaintsteban.liste.envies.service;

import com.google.common.collect.Lists;
import com.googlecode.objectify.Work;
import com.googlecode.objectify.cmd.Saver;
import fr.desaintsteban.liste.envies.model.*;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Properties;

public final class NotificationsService {
    private NotificationsService() {}

	public static List<ListEnvies> list() {
		List<ListEnvies> list = OfyService.ofy().load().type(ListEnvies.class).list();
		return list;
	}

	public static List<Notification> list(AppUser user) {
		List<Notification> list = OfyService.ofy().load().type(Notification.class).filter("user =",user.getEmail()).order("-date").limit(10).list();
		return list;
	}

	public static Notification notify(NotificationType type, final AppUser currentUser, ListEnvies listEnvies, boolean noOwners) {
		return notify(type, currentUser, listEnvies, noOwners, "");
	}

	public static Notification notify(NotificationType type, final AppUser currentUser, final ListEnvies listEnvies, boolean noOwners, final String message) {
		final Notification newNotif = new Notification();

		newNotif.setType(type);
		newNotif.setListId(listEnvies.getName());
		newNotif.setListName(listEnvies.getTitle());
		newNotif.setDate(new Date());
		newNotif.setMessage(message);
		newNotif.setActionUser(currentUser.getEmail());
		newNotif.setActionUserName(currentUser.getName());

		List<String> users = new ArrayList<>();
		for (UserShare userShare : listEnvies.getUsers()) {
			if (userShare.getType() == UserShareType.OWNER && noOwners || userShare.getEmail().equals(currentUser.getEmail())) continue;
			users.add(userShare.getEmail());
		}

		newNotif.setUser(users);

		return OfyService.ofy().transact(new Work<Notification>() {
			@Override
			public Notification run() {
				final Saver saver = OfyService.ofy().save();
				saver.entities(newNotif).now();
				return newNotif;
			}
		});
	}


	public static Notification notifyUserAddedToList(final ListEnvies list, List<String> users, final AppUser currentUser) {
		final Notification newNotif = new Notification();
		newNotif.setType(NotificationType.ADD_USER);
		newNotif.setListId(list.getName());
		newNotif.setListName(list.getTitle());
		newNotif.setUser(users);
		newNotif.setActionUser(currentUser.getEmail());
		newNotif.setActionUserName(currentUser.getName());
		return OfyService.ofy().transact(new Work<Notification>() {
			@Override
			public Notification run() {
				final Saver saver = OfyService.ofy().save();
				saver.entities(newNotif).now();
				//sendMailAddToList(newNotif, currentUser);
				return newNotif;
			}
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
