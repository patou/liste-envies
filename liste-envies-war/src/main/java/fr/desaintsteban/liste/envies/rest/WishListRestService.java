package fr.desaintsteban.liste.envies.rest;

import fr.desaintsteban.liste.envies.dto.WishListDto;
import fr.desaintsteban.liste.envies.enums.SharingPrivacyType;
import fr.desaintsteban.liste.envies.model.AppUser;
import fr.desaintsteban.liste.envies.model.WishList;
import fr.desaintsteban.liste.envies.service.WishListService;
import fr.desaintsteban.liste.envies.util.ServletUtils;
import fr.desaintsteban.liste.envies.util.WishRules;

import javax.ws.rs.*;
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
        final AppUser user = ServletUtils.getUserAuthenticated();
        if(user != null){
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
        final AppUser user = ServletUtils.getUserAuthenticated();
        if(user != null){
            LOGGER.info("List authorized liste for user: "+email);
            List<WishList> list = WishListService.list(email);
            return WishRules.applyRules(user, list);
        }
        return null;
    }

    /**
     * Récuppère toutes les listes pour l'administration
     * @return
     */
    @GET
    @Path("/all")
    public List<WishListDto> getAllList() {
        final AppUser user = ServletUtils.getUserAuthenticated();
        if(user != null && user.isAdmin()){
            LOGGER.info("List all WishList");
            List<WishList> list = WishListService.list();

            return WishRules.applyRules(user, list);
        }
        return null;
    }

    @POST
    @Path("/{name}")
    public WishListDto updateWishList(@PathParam("name") String name, WishListDto wishListDto) {
        final AppUser user = ServletUtils.getUserAuthenticated();
        if (user != null) {
            LOGGER.info("Save WishList " + wishListDto.getName());
            WishList orUpdate = WishListService.createOrUpdate(user, new WishList(wishListDto));
            return WishRules.applyRules(user, orUpdate);
        }
        return null;
    }

    @PUT
    @Path("/{name}/{new}")
    public void renameWishList(@PathParam("name") String name, @PathParam("new") String newName) throws Exception {
        final AppUser user = ServletUtils.getUserAuthenticated();
        if (user != null) {
            LOGGER.info("rename WishList " + name + " to " + newName);
            WishListService.rename(user, name, newName);
        }
        else {
            throw new Exception("Use not logged");
        }
    }

    @POST
    public WishListDto addWishList(WishListDto wishListDto) {
        final AppUser user = ServletUtils.getUserAuthenticated();
        if (user != null) {
            LOGGER.info("Add WishList " + wishListDto.getName());
            WishList wishList = WishListService.createOrUpdate(user, new WishList(wishListDto));
            return WishRules.applyRules(user, wishList);
        }
        return null;
    }

    @GET
    @Path("/{name}")
    public WishListDto getOneWishListForUser(@PathParam("name") String wishName) {
        final AppUser user = ServletUtils.getUserAuthenticated();
        LOGGER.info("Get " + wishName);
        WishList wishList = WishListService.get(wishName);
        return WishRules.applyRules(user, wishList);
    }

    @GET
    @Path("/{name}/join")
    public WishListDto join(@PathParam("name") String wishName) {
        final AppUser user = ServletUtils.getUserAuthenticated();
        WishList list = WishListService.get(wishName);
        if (user != null && list.getPrivacy() == SharingPrivacyType.OPEN) {
            WishListService.addUser(user, list);
            return WishRules.applyRules(user, list);
        }
        throw new RuntimeException("not allowed");
    }

    @DELETE
    @Path("/{name}")
    public void deleteWishList(@PathParam("name") String name){
        final AppUser user = ServletUtils.getUserAuthenticated();
        if(user != null){
            LOGGER.info("name " + name);
            WishListService.delete(name);
        }
    }

}
