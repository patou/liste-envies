package fr.desaintsteban.liste.envies.rest;

import fr.desaintsteban.liste.envies.dto.EnvyDto;
import fr.desaintsteban.liste.envies.dto.NoteDto;
import fr.desaintsteban.liste.envies.model.AppUser;
import fr.desaintsteban.liste.envies.model.Envy;
import fr.desaintsteban.liste.envies.service.EnviesService;
import fr.desaintsteban.liste.envies.util.ServletUtils;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;
import java.util.stream.Collectors;

@Path("/envies/{name}")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class EnviesRestService {
    private static final Logger LOGGER = Logger.getLogger(EnviesRestService.class.getName());

    @GET
    @Path("/{id}")
    public EnvyDto getEnvie(@PathParam("name") String name, @PathParam("id") Long id) {
        final AppUser user = ServletUtils.getUserAuthenticated();
        if(user != null){
            LOGGER.info("Get " + id);
            Envy envie = EnviesService.get(user, name, id);
            if (envie != null)
                return envie.toDto();
        }
        return null;
    }

    @PUT
    @Path("/give/{id}")
    public EnvyDto give(@PathParam("name") String name, @PathParam("id") Long id) {
        final AppUser user = ServletUtils.getUserAuthenticated();
        if (user != null){
            LOGGER.info("Give " + id);
            return EnviesService.given(user, name, id);
        }
        return null;
    }


    @DELETE
    @Path("/give/{id}")
    public EnvyDto cancel(@PathParam("name") String name, @PathParam("id") Long id) {
        final AppUser user = ServletUtils.getUserAuthenticated();
        if (user != null){
            LOGGER.info("Cancel " + id);
            return EnviesService.cancel(user, name, id);
        }
        return null;
    }

    @GET
    public List<EnvyDto> getEnvie(@PathParam("name") String name) {
        final AppUser user = ServletUtils.getUserAuthenticated();
        if(user != null){
            LOGGER.info("List");
            List<Envy> list = EnviesService.list(user, name);
            List<EnvyDto> result = list.stream().map(Envy::toDto).collect(Collectors.toList());
            return result;
        }
        return null;
    }



    @POST
    public EnvyDto addEnvie(@PathParam("name") String name, EnvyDto envie) {
        final AppUser user = ServletUtils.getUserAuthenticated();
        if (user != null) {
            LOGGER.info("Put " + envie.getLabel());
            return EnviesService.createOrUpdate(user, name, new Envy(envie));
        }
        return null;
    }

    @POST
    @Path("/{id}/addNote")
    public EnvyDto addNote(@PathParam("name") String name, @PathParam("id") Long envieId, NoteDto note) {
        final AppUser user = ServletUtils.getUserAuthenticated();
        if (user != null) {
            LOGGER.info("add note from " + user.getName()+"envie id : "+envieId+" Note : "+note.getText());
            EnvyDto envyDto = EnviesService.addNote(user, envieId, name, note);
            LOGGER.info("Updated envie with notes " + envyDto.getLabel());
            return envyDto;
        }
        return null;
    }

    @POST
    @Path("/{id}")
    public EnvyDto updateEnvie(@PathParam("name") String name, EnvyDto envie) {
        final AppUser user = ServletUtils.getUserAuthenticated();
        if (user != null) {
            LOGGER.info("Put " + envie.getLabel());
            return EnviesService.createOrUpdate(user, name, new Envy(envie));
        }
        return envie;
    }

    @DELETE
    @Path("/{id}")
    public void deleteEnvie(@PathParam("name") String name, @PathParam("id") Long id){
        final AppUser user = ServletUtils.getUserAuthenticated();
        if(user != null){
            LOGGER.info("Delete " + id);
            EnviesService.delete(user, name, id);
        }
    }

    @PUT
    @Path("/archive/{id}")
    public void archiveEnvie(@PathParam("name") String name, @PathParam("id") Long id){
        final AppUser user = ServletUtils.getUserAuthenticated();
        if(user != null){
            LOGGER.info("Archive " + id);
            EnviesService.archive(user, name, id);
        }
    }
}
