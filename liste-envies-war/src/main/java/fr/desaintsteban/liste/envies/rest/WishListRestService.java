package fr.desaintsteban.liste.envies.rest;

import fr.desaintsteban.liste.envies.dto.WishListDto;
import fr.desaintsteban.liste.envies.enums.SharingPrivacyType;
import fr.desaintsteban.liste.envies.exception.NotAllowedException;
import fr.desaintsteban.liste.envies.model.AppUser;
import fr.desaintsteban.liste.envies.model.WishList;
import fr.desaintsteban.liste.envies.service.WishListService;
import fr.desaintsteban.liste.envies.util.ServletUtils;
import fr.desaintsteban.liste.envies.util.WishRules;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import java.util.List;
import java.util.logging.Logger;

@Path("/list")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class WishListRestService {
    private static final Logger LOGGER = Logger.getLogger(WishListRestService.class.getName());

    @GET
    public List<WishListDto> getWishListForUser() {
        AppUser user = null;
        if(ServletUtils.isUserConnected()){
            user = ServletUtils.getUserConnected();
            LOGGER.info("List users");
            List<WishList> list = WishListService.list(user.getEmail());
            if (!list.isEmpty()) {
                return WishRules.applyRules(user, list);
            }
        }
        LOGGER.info("Get demo list for demo");
        List<WishList> list = WishListService.list("demo-liste-envie@desaintsteban.fr");

        if (!list.isEmpty()) {
            return WishRules.applyRules(user, list);
        }
        return null;
    }

    /**
     * Récupère les listes d'un utilisateur filtré par l'utilisateur courant
     * @param email
     * @return
     */
    @GET
    @Path("/of/{email}")
    public List<WishListDto> getWishListForUser(@PathParam("email") String email) {
        final AppUser user = ServletUtils.getUserConnected();
        List<WishList> list = WishListService.list(email);
        return WishRules.applyRules(user, list);
    }

    /**
     * Récuppère toutes les listes pour l'administration
     * @return
     */
    @GET
    @Path("/all")
    public List<WishListDto> getAllList() {
        final AppUser user = ServletUtils.getUserConnected();
        if(user.isAdmin()){
            LOGGER.info("List all WishList by " + user.getName());
            List<WishList> list = WishListService.list();
            return WishRules.applyRules(user, list);
        }
        throw new NotAllowedException();
    }

    @POST
    @Path("/{name}")
    public WishListDto updateWishList(@PathParam("name") String name, WishListDto wishListDto) {
        final AppUser user = ServletUtils.getUserConnected();
        LOGGER.info("Save WishList " + wishListDto.getName());
        WishList orUpdate = WishListService.createOrUpdate(user, new WishList(wishListDto));
        return WishRules.applyRules(user, orUpdate);
    }

    @PUT
    @Path("/{name}/{new}")
    public void renameWishList(@PathParam("name") String name, @PathParam("new") String newName) throws Exception {
        final AppUser user = ServletUtils.getUserConnected();
        LOGGER.info("rename WishList " + name + " to " + newName);
        WishListService.rename(user, name, newName);
    }

    @POST
    public WishListDto addWishList(WishListDto wishListDto) {
        final AppUser user = ServletUtils.getUserConnected();
        LOGGER.info("Add WishList " + wishListDto.getName());
        WishList wishList = WishListService.createOrUpdate(user, new WishList(wishListDto));
        return WishRules.applyRules(user, wishList);
    }

    @GET
    @Path("/{name}")
    public WishListDto getOneWishListForUser(@PathParam("name") String wishName) {
        LOGGER.info("Get " + wishName);
        WishList wishList = WishListService.getOrThrow(wishName);
        final AppUser user = ServletUtils.getUserConnected();
        return WishRules.applyRules(user, wishList);
    }

    @GET
    @Path("/{name}/join")
    public WishListDto join(@PathParam("name") String wishName) {
        AppUser user = null;
        if(ServletUtils.isUserConnected()){
            user = ServletUtils.getUserConnected();
        }
        WishList list = WishListService.getOrThrow(wishName);
        // Sur une liste ouverte, on rejoint la liste dès que l'on visite la liste.
        if (list.getPrivacy() == SharingPrivacyType.OPEN) {
            WishListService.addUser(user, list);
        }
        return WishRules.applyRules(user, list);
    }

    @DELETE
    @Path("/{name}")
    public void deleteWishList(@PathParam("name") String name){
        final AppUser user = ServletUtils.getUserConnected();
        if(user.isAdmin()){
            LOGGER.info("Delete wish list : " + name + " by " + user.getName());
            WishListService.delete(name);
        }
        throw new NotAllowedException();
    }

    @PUT
    @Path("/{name}/archive/")
    public void archiveWishList(@PathParam("name") String name) throws Exception {
        final AppUser user = ServletUtils.getUserConnected();
        LOGGER.info("Archive wish list : " + name + " by " + user.getName());
        WishListService.archive(user, name);
    }
}
