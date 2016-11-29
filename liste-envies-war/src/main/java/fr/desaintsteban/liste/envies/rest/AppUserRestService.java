package fr.desaintsteban.liste.envies.rest;

import fr.desaintsteban.liste.envies.model.AppUser;
import fr.desaintsteban.liste.envies.service.AppUserService;
import fr.desaintsteban.liste.envies.util.ServletUtils;

import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import java.util.List;
import java.util.logging.Logger;

@Path("/utilisateur")
@Produces(MediaType.APPLICATION_JSON)
public class AppUserRestService {
    private static final Logger LOGGER = Logger.getLogger(AppUserRestService.class.getName());

    @GET
    public List<AppUser> getAppUsers() {
        final AppUser user = ServletUtils.getUserAuthenticated();
        if(user != null && user.isAdmin()){
            LOGGER.info("List appuser");
            return AppUserService.list();
        }
        return null;
    }

    @PUT
    public AppUser addUser(AppUser appUser) {
        final AppUser user = ServletUtils.getUserAuthenticated();
        if (user != null && user.isAdmin()) {
            LOGGER.info("Put " + appUser.getEmail());
            return AppUserService.createOrUpdate(appUser);
        }
        return null;
    }

    @GET
    @Path("/{email}")
    public AppUser addUser(@PathParam("email") String email) {
        final AppUser user = ServletUtils.getUserAuthenticated();
        if (user != null && user.isAdmin()) {
            LOGGER.info("Get " + email);
            return AppUserService.get(email);
        }
        return null;
    }

    @DELETE
    @Path("/{email}")
    public void deleteEnvie(@PathParam("email") String email){
        final AppUser user = ServletUtils.getUserAuthenticated();
        if(user != null && user.isAdmin()){
            LOGGER.info("Delete " + email);
            AppUserService.delete(email);
        }
    }
}
