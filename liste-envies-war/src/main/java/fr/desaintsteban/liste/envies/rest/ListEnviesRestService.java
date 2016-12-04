package fr.desaintsteban.liste.envies.rest;

import fr.desaintsteban.liste.envies.dto.ListEnviesDto;
import fr.desaintsteban.liste.envies.model.AppUser;
import fr.desaintsteban.liste.envies.model.ListEnvies;
import fr.desaintsteban.liste.envies.model.UserShare;
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
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

@Path("/liste")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ListEnviesRestService {
    private static final Logger LOGGER = Logger.getLogger(ListEnviesRestService.class.getName());

    @GET
    public List<ListEnviesDto> getListEnvies() {
        final AppUser user = ServletUtils.getUserAuthenticated();
        if(user != null){
            LOGGER.info("List appuser");
            List<ListEnvies> list = ListEnviesService.list(user.getEmail());
            ArrayList<ListEnviesDto> convertList = new ArrayList<>();
            for (ListEnvies listeEnvy : list) {
                convertList.add(listeEnvy.toDto(false, user.getEmail(), null));
            }
            return convertList;
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
            LOGGER.info("List appuser");
            List<ListEnvies> list = ListEnviesService.list(email);
            ArrayList<ListEnviesDto> convertList = new ArrayList<>();
            for (ListEnvies listeEnvy : list) {
                if (listeEnvy.containsOwner(email) && (listeEnvy.containsUser(user.getEmail()) || user.isAdmin())) {
                    convertList.add(listeEnvy.toDto(false, user.getEmail(), null));
                }
            }
            return convertList;
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
            ArrayList<ListEnviesDto> convertList = new ArrayList<>();
            for (ListEnvies listeEnvy : list) {
                convertList.add(listeEnvy.toDto(false, user.getEmail(), null));
            }
            return convertList;
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
            LOGGER.info("Save ListEnvies " + listEnvies.getName());
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
            List<String> emails = new ArrayList<>();
            for (UserShare userShare : listEnvie.getUsers()) {
                emails.add(userShare.getEmail());
            }
            map = AppUserService.loadAll(emails);
        }
        return listEnvie.toDto(true, user.getEmail(), map);
    }
}
