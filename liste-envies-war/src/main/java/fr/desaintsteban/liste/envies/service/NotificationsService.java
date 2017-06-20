package fr.desaintsteban.liste.envies.service;

import com.googlecode.objectify.Key;
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
import java.util.List;
import java.util.Properties;

public final class NotificationsService {
    private NotificationsService() {}

	public static List<ListEnvies> list() {
		List<ListEnvies> list = OfyService.ofy().load().type(ListEnvies.class).list();
		return list;
	}

	public static List<ListEnvies> list(String email) {
		List<ListEnvies> list = OfyService.ofy().load().type(ListEnvies.class).filter("users.email =", email).list();
		return list;
	}

	public static List<Notification> loadAll(List<Key<ListEnvies>> keys) {
    	return OfyService.ofy().load().type(Notification.class)/*.ancestor(keys).filterKey("in", keys).order("-date").order("parentListName").order("notificationType")*/.list();
	}

	public static List<Notification> loadAllByListName(List<String> ListNames) {
		return OfyService.ofy().load().type(Notification.class).filter("parentListName in", ListNames).order("-date").order("parentListName").order("notificationType").list();
	}

	public static void delete(String email) {
		OfyService.ofy().delete().key(Key.create(ListEnvies.class, email)).now();
	}

	public static ListEnvies get(String email) {
		return OfyService.ofy().load().key(Key.create(ListEnvies.class, email)).now();
	}

	public static Notification notify(NotificationType type, final Envy item, final AppUser currentUser, final String listName) {
		return notify(type, item, currentUser, listName, "");
	}

	public static Notification notify(NotificationType type, final Envy item, final AppUser currentUser, final String listName, final String message) {
		final Notification newNotif = new Notification();

		newNotif.setNotificationType(type);
		newNotif.setWish(item);
		newNotif.setParentListId(item.getList());
		newNotif.setParentListName(listName);
		newNotif.setOwner(currentUser);
		newNotif.setMessage(message);



		return OfyService.ofy().transact(new Work<Notification>() {
			@Override
			public Notification run() {
				final Saver saver = OfyService.ofy().save();
				saver.entities(newNotif).now();
				return newNotif;
			}
		});
	}


	public static Notification notifyUserAddedToList(final ListEnvies list, UserShare userToAdd, final AppUser currentUser) {
		final Notification newNotif = new Notification();


		newNotif.setNotificationType(NotificationType.ADD_USER);
		newNotif.setParentList(list);
		newNotif.setAddedUser(userToAdd);
		newNotif.setOwner(currentUser);


		return OfyService.ofy().transact(new Work<Notification>() {
			@Override
			public Notification run() {
				final Saver saver = OfyService.ofy().save();
				saver.entities(newNotif).now();

				sendMailAddToList(newNotif, currentUser);

				return newNotif;
			}
		});
	}

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
	}
}
