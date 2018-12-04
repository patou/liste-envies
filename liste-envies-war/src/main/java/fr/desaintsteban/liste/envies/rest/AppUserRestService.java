package fr.desaintsteban.liste.envies.rest;

import fr.desaintsteban.liste.envies.dto.AppUserDto;
import fr.desaintsteban.liste.envies.dto.WishDto;
import fr.desaintsteban.liste.envies.dto.NotificationDto;
import fr.desaintsteban.liste.envies.model.AppUser;
import fr.desaintsteban.liste.envies.model.Wish;
import fr.desaintsteban.liste.envies.model.Notification;
import fr.desaintsteban.liste.envies.model.WishList;
import fr.desaintsteban.liste.envies.service.AppUserService;
import fr.desaintsteban.liste.envies.service.WishListService;
import fr.desaintsteban.liste.envies.service.WishesService;
import fr.desaintsteban.liste.envies.service.NotificationsService;
import fr.desaintsteban.liste.envies.util.ServletUtils;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;
import java.util.stream.Collectors;

import static java.util.stream.Collectors.toList;

@Path("/utilisateur")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AppUserRestService {
    private static final Logger LOGGER = Logger.getLogger(AppUserRestService.class.getName());

    @GET
    public List<AppUserDto> getAppUsers() {
        final AppUser user = ServletUtils.getUserAuthenticated();
        if(user != null){
            LOGGER.info("List appuser");
            List<AppUser> list = AppUserService.list();
            List<AppUserDto> convertList = list.stream().map(appUser -> new AppUserDto(appUser.getEmail(), appUser.getName(),   appUser.getPicture(),  appUser.getBirthday(), appUser.isNewUser())).collect(toList());
            return convertList;
        }
        return null;
    }

    @GET
    @Path("/my")
    public AppUserDto getMyAccount() {
        AppUser appUser = ServletUtils.getUserAuthenticated();
        if (appUser != null) {
            return new AppUserDto(appUser.getEmail(), appUser.getName(), appUser.getPicture(), appUser.getBirthday(), appUser.isNewUser());
        }
        return null;
    }

    @POST
    @Path("/{email}")
    public AppUserDto addUser(@PathParam("email") String email, AppUserDto appUser) {
        final AppUser user = ServletUtils.getUserAuthenticated();
        if (user != null) {
            LOGGER.info("Put " + appUser.getEmail());
            AppUser orUpdate = AppUserService.createOrUpdate(new AppUser(appUser.getEmail(), appUser.getName(), appUser.getBirthday()));
            return new AppUserDto(orUpdate.getEmail(), orUpdate.getName(),  orUpdate.getPicture(), orUpdate.getBirthday(), orUpdate.isNewUser());
        }
        return null;
    }

    @GET
    @Path("/{email}")
    public AppUserDto getUser(@PathParam("email") String email) {
        LOGGER.info("Get " + email);
        AppUser appUser = AppUserService.get(email);
        return new AppUserDto(appUser.getEmail(), appUser.getName(), appUser.getPicture(), appUser.getBirthday(), appUser.isNewUser());
    }


    @GET
    @Path("/{email}/notifications")
    public List<NotificationDto> getUserNotifications(@PathParam("email") String email) {
        List<NotificationDto> listNotification = new ArrayList<>();
        final AppUser user = ServletUtils.getUserAuthenticated();
        if (user == null)  return listNotification;

        List<Notification> notifs = NotificationsService.list(user);
        if (notifs.isEmpty()) return listNotification;

        listNotification = notifs.stream().map(Notification::toDto).collect(toList());
        return listNotification;
    }


    @DELETE
    @Path("/{email}")
    public void deleteUser(@PathParam("email") String email){
        final AppUser user = ServletUtils.getUserAuthenticated();
        if(user != null && user.isAdmin()){
            LOGGER.info("Delete " + email);
            AppUserService.delete(email);
        }
    }

    @GET
    @Path("/{email}/archived")
    public List<WishDto> getArchivedWished(@PathParam("email") String email) {
        final AppUser user = ServletUtils.getUserAuthenticated();
        if(user != null){
            LOGGER.info("List archive from " +  email);
            return WishesService.archived(user);
        }
        return null;
    }


    @GET
    @Path("/{email}/given")
    public List<WishDto> getGivenWished(@PathParam("email") String email) {
        final AppUser user = ServletUtils.getUserAuthenticated();
        if(user != null){
            LOGGER.info("List given of " + email);
            return WishesService.given(user);
        }
        return null;
    }
}
