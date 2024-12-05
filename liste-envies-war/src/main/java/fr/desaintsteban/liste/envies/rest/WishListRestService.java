package fr.desaintsteban.liste.envies.rest;

import fr.desaintsteban.liste.envies.dto.WishListDto;
import fr.desaintsteban.liste.envies.enums.SharingPrivacyType;
import fr.desaintsteban.liste.envies.exception.NotAllowedException;
import fr.desaintsteban.liste.envies.model.AppUser;
import fr.desaintsteban.liste.envies.model.WishList;
import fr.desaintsteban.liste.envies.service.WishListService;
import fr.desaintsteban.liste.envies.util.ServletUtils;
import fr.desaintsteban.liste.envies.util.WishRules;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;

import java.util.List;
import java.util.logging.Logger;

@Path("/list")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class WishListRestService {
    private static final Logger LOGGER = Logger.getLogger(WishListRestService.class.getName());

    @GET
    public List<WishListDto> getWishListForUser() {
        AppUser user = ServletUtils.isUserConnected() ? ServletUtils.getUserConnected() : null;
        LOGGER.info("List users");

        List<WishList> list = user != null
                ? WishListService.list(user.getEmail())
                : WishListService.list("demo-liste-envie@desaintsteban.fr");

        if (!list.isEmpty()) {
            return WishRules.applyRules(user, list);
        }

        LOGGER.info("No wish lists found");
        return null;
    }

    @GET
    @Path("/of/{email}")
    public List<WishListDto> getWishListForUser(@PathParam("email") String email) {
        AppUser user = ServletUtils.getUserConnected();
        List<WishList> list = WishListService.list(email);
        return WishRules.applyRules(user, list);
    }

    @GET
    @Path("/all")
    public List<WishListDto> getAllList() {
        AppUser user = ServletUtils.getUserConnected();
        if (user.isAdmin()) {
            LOGGER.info("List all WishLists by " + user.getName());
            List<WishList> list = WishListService.list();
            return WishRules.applyRules(user, list);
        }
        throw new NotAllowedException();
    }

    @POST
    @Path("/{name}")
    public WishListDto updateWishList(@PathParam("name") String name, WishListDto wishListDto) {
        AppUser user = ServletUtils.getUserConnected();
        LOGGER.info("Save WishList " + wishListDto.getName());
        WishList updatedList = WishListService.createOrUpdate(user, new WishList(wishListDto));
        return WishRules.applyRules(user, updatedList);
    }

    @PUT
    @Path("/{name}/{new}")
    public void renameWishList(@PathParam("name") String name, @PathParam("new") String newName) throws Exception {
        AppUser user = ServletUtils.getUserConnected();
        LOGGER.info("Rename WishList " + name + " to " + newName);
        WishListService.rename(user, name, newName);
    }

    @POST
    public WishListDto addWishList(WishListDto wishListDto) {
        AppUser user = ServletUtils.getUserConnected();
        LOGGER.info("Add WishList " + wishListDto.getName());
        WishList wishList = WishListService.createOrUpdate(user, new WishList(wishListDto));
        return WishRules.applyRules(user, wishList);
    }

    @GET
    @Path("/{name}")
    public WishListDto getOneWishListForUser(@PathParam("name") String wishName) {
        LOGGER.info("Get " + wishName);
        WishList wishList = WishListService.getOrThrow(wishName);
        AppUser user = ServletUtils.isUserConnected() ? ServletUtils.getUserConnected() : null;
        return WishRules.applyRules(user, wishList);
    }

    @GET
    @Path("/{name}/join")
    public WishListDto join(@PathParam("name") String wishName) {
        AppUser user = ServletUtils.isUserConnected() ? ServletUtils.getUserConnected() : null;
        WishList list = WishListService.getOrThrow(wishName);

        if (list.getPrivacy() == SharingPrivacyType.OPEN) {
            WishListService.addUser(user, list);
        }

        return WishRules.applyRules(user, list);
    }

    @DELETE
    @Path("/{name}")
    public void deleteWishList(@PathParam("name") String name) {
        AppUser user = ServletUtils.getUserConnected();
        if (user.isAdmin()) {
            LOGGER.info("Delete WishList: " + name + " by " + user.getName());
            WishListService.delete(name);
            return;
        }
        throw new NotAllowedException();
    }

    @PUT
    @Path("/{name}/archive/")
    public void archiveWishList(@PathParam("name") String name) throws Exception {
        AppUser user = ServletUtils.getUserConnected();
        LOGGER.info("Archive WishList: " + name + " by " + user.getName());
        WishListService.archive(user, name);
    }
}
