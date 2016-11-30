package fr.desaintsteban.liste.envies.rest;

import fr.desaintsteban.liste.envies.dto.EnvieDto;
import fr.desaintsteban.liste.envies.model.AppUser;
import fr.desaintsteban.liste.envies.model.Envie;
import fr.desaintsteban.liste.envies.service.EnviesService;
import fr.desaintsteban.liste.envies.util.ServletUtils;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

@Path("/liste/{email}/envies")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class EnviesRestService {
    private static final Logger LOGGER = Logger.getLogger(EnviesRestService.class.getName());

    @GET
    @Path("/{id}")
    public EnvieDto getEnvie(@PathParam("email") String email, @PathParam("id") Long id) {
        final AppUser user = ServletUtils.getUserAuthenticated();
        if(user != null){
            LOGGER.info("Get " + id);
            Envie envie = EnviesService.get(user, email, id);
            if (envie != null)
                return envie.toDto();
        }
        return null;
    }

    @PUT
    @Path("/{id}/give")
    public void give(@PathParam("email") String email, @PathParam("id") Long id) {
        final AppUser user = ServletUtils.getUserAuthenticated();
        if (user != null){
            LOGGER.info("Get " + id);
            EnviesService.given(user, email, id);
        }
    }


    @PUT
    @Path("/{id}/cancel")
    public void cancel(@PathParam("email") String email, @PathParam("id") Long id) {
        final AppUser user = ServletUtils.getUserAuthenticated();
        if (user != null){
            LOGGER.info("Get " + id);
            EnviesService.cancel(user, email, id);
        }
    }

    @GET
    public List<EnvieDto> getEnvie(@PathParam("email") String email) {
        final AppUser user = ServletUtils.getUserAuthenticated();
        if(user != null){
            LOGGER.info("List");
            List<Envie> list = EnviesService.list(user, email);
            List<EnvieDto> result = new ArrayList<>(list.size());
            for (Envie envie : list) {
                result.add(envie.toDto());
            }
            return result;
        }
        return null;
    }

    @POST
    public void addEnvie(@PathParam("email") String email, EnvieDto envie) {
        final AppUser user = ServletUtils.getUserAuthenticated();
        if (user != null) {
            LOGGER.info("Put " + envie.getLabel());
            EnviesService.createOrUpdate(user, email, new Envie(envie));
        }
    }

    @POST
    @Path("/{id}")
    public void updateEnvie(@PathParam("email") String email, EnvieDto envie) {
        final AppUser user = ServletUtils.getUserAuthenticated();
        if (user != null) {
            LOGGER.info("Put " + envie.getLabel());
            EnviesService.createOrUpdate(user, email, new Envie(envie));
        }
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
