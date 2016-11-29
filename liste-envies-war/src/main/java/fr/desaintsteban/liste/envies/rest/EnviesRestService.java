package fr.desaintsteban.liste.envies.rest;

import fr.desaintsteban.liste.envies.model.AppUser;
import fr.desaintsteban.liste.envies.model.Envie;
import fr.desaintsteban.liste.envies.service.EnviesService;
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

@Path("/liste/{email}/envies")
@Produces(MediaType.APPLICATION_JSON)
public class EnviesRestService {
    private static final Logger LOGGER = Logger.getLogger(EnviesRestService.class.getName());

    @GET
    @Path("/{id}")
    public Envie getEnvie(@PathParam("email") String email, @PathParam("id") Long id) {
        final AppUser user = ServletUtils.getUserAuthenticated();
        if(user != null){
            LOGGER.info("Get " + id);
            return EnviesService.get(user, email, id);
        }
        return null;
    }

    @PUT
    @Path("/{id}/give")
    public void give(@PathParam("email") String email, @PathParam("id") Long id) {
        final AppUser user = ServletUtils.getUserAuthenticated();
        if(user != null){
            LOGGER.info("Get " + id);
            EnviesService.given(user, email, id);
        }
    }

    @GET
    public List<Envie> getEnvie(@PathParam("email") String email) {
        final AppUser user = ServletUtils.getUserAuthenticated();
        if(user != null){
            LOGGER.info("List");
            return EnviesService.list(user, email);
        }
        return null;
    }

    @PUT
    public Envie addEnvie(@PathParam("email") String email, Envie envie) {
        final AppUser user = ServletUtils.getUserAuthenticated();
        if (user != null) {
            LOGGER.info("Put " + envie.getLabel());
            return EnviesService.createOrUpdate(user, email, envie);
        }
        return null;
    }

    @DELETE
    @Path("/{id}")
    public void deleteEnvie(@PathParam("email") String email, @PathParam("id") Long id){
        final AppUser user = ServletUtils.getUserAuthenticated();
        if(user != null){
            LOGGER.info("Delete " + id);
            EnviesService.delete(user, email, id);
        }
    }
}
