package fr.desaintsteban.liste.envies.rest;

import fr.desaintsteban.liste.envies.dto.ListEnviesDto;
import fr.desaintsteban.liste.envies.model.AppUser;
import fr.desaintsteban.liste.envies.model.ListEnvies;
import fr.desaintsteban.liste.envies.model.UserShare;
import fr.desaintsteban.liste.envies.model.UserShareType;
import fr.desaintsteban.liste.envies.service.AppUserService;
import fr.desaintsteban.liste.envies.service.ListEnviesService;
import fr.desaintsteban.liste.envies.util.ServletUtils;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import java.util.*;
import java.util.logging.Logger;
import java.util.stream.Collectors;

import static java.util.stream.Collectors.toList;
import static java.util.stream.Collectors.toSet;

@Path("/liste")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ListEnviesRestService {
    private static final Logger LOGGER = Logger.getLogger(ListEnviesRestService.class.getName());

    @GET
    public List<ListEnviesDto> getListEnvies() {
        final AppUser user = ServletUtils.getUserAuthenticated();
        if(user != null){
            LOGGER.info("List users");
            List<ListEnvies> list = ListEnviesService.list(user.getEmail());
            return getListEnviesDtos(user, list);
        }
        return null;
    }

    /**
     * Récuppère les listes d'un utilisateur filtré par l'utilisateur courant
     * @param email
     * @return
     */
    @GET
    @Path("/of/{email}")
    public List<ListEnviesDto> getListEnvies(@PathParam("email") String email) {
        final AppUser user = ServletUtils.getUserAuthenticated();
        if(user != null){
            LOGGER.info("List authorized liste for user: "+email);
            List<ListEnvies> list = ListEnviesService.list(email);
            return list.stream().filter(listeEnvy -> listeEnvy.containsOwner(email) && (listeEnvy.containsUser(user.getEmail()) || user.isAdmin())).map(listeEnvy -> listeEnvy.toDto(false, user.getEmail(), null)).collect(toList());
        }
        return null;
    }

    /**
     * Récuppère toutes les listes pour l'administration
     * @return
     */
    @GET
    @Path("/all")
    public List<ListEnviesDto> getAllList() {
        final AppUser user = ServletUtils.getUserAuthenticated();
        if(user != null && user.isAdmin()){
            LOGGER.info("List all ListEnvies");
            List<ListEnvies> list = ListEnviesService.list();
            return list.stream().map(listeEnvy -> listeEnvy.toDto(false, user.getEmail(), null)).collect(toList());
        }
        return null;
    }

    @POST
    @Path("/{name}")
    public ListEnviesDto updateListeEnvie(@PathParam("name") String name, ListEnviesDto listEnvies) {
        final AppUser user = ServletUtils.getUserAuthenticated();
        if (user != null) {
            LOGGER.info("Save ListEnvies " + listEnvies.getName());
            ListEnvies orUpdate = ListEnviesService.createOrUpdate(user, new ListEnvies(listEnvies));
            return orUpdate.toDto(true, user.getEmail(), null);
        }
        return null;
    }

    @POST
    @Path("/")
    public ListEnviesDto addListeEnvie(ListEnviesDto listEnvies) {
        final AppUser user = ServletUtils.getUserAuthenticated();
        if (user != null) {
            LOGGER.info("Add ListEnvies " + listEnvies.getName());
            ListEnvies listEnvie = ListEnviesService.createOrUpdate(user, new ListEnvies(listEnvies));
            return getListEnviesDto(user, listEnvie);
        }
        return null;
    }

    @GET
    @Path("/{name}")
    public ListEnviesDto getUser(@PathParam("name") String email) {
        final AppUser user = ServletUtils.getUserAuthenticated();
        if (user != null) {
            LOGGER.info("Get " + email);
            ListEnvies listEnvies = ListEnviesService.get(email);
            return getListEnviesDto(user, listEnvies);
        }
        return null;
    }

    @DELETE
    @Path("/{name}")
    public void deleteEnvie(@PathParam("name") String name){
        final AppUser user = ServletUtils.getUserAuthenticated();
        if(user != null){
            LOGGER.info("name " + name);
            ListEnviesService.delete(name);
        }
    }

    private ListEnviesDto getListEnviesDto(AppUser user, ListEnvies listEnvie) {
        Map<String,AppUser> map = null;
        if (listEnvie.getUsers() != null) {
            List<String> emails = listEnvie.getUsers().stream().map(UserShare::getEmail).collect(toList());
            map = AppUserService.loadAll(emails);
        }
        return listEnvie.toDto(true, user.getEmail(), map);
    }

    private List<ListEnviesDto> getListEnviesDtos(AppUser user, List<ListEnvies> list) {
        Set<String> emails = list.stream().flatMap(listEnvies -> listEnvies.getUsers().stream()).filter(userShare -> userShare.getType() == UserShareType.OWNER).map(UserShare::getEmail).collect(toSet());
        final Map<String,AppUser> map = AppUserService.loadAll(emails);
        return list.stream().map(listeEnvy -> listeEnvy.toDto(false, user.getEmail(), map)).collect(toList());
    }
}
