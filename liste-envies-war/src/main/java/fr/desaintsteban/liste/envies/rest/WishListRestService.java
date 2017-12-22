package fr.desaintsteban.liste.envies.rest;

import fr.desaintsteban.liste.envies.dto.WishListDto;
import fr.desaintsteban.liste.envies.enums.SharingPrivacyType;
import fr.desaintsteban.liste.envies.model.AppUser;
import fr.desaintsteban.liste.envies.model.WishList;
import fr.desaintsteban.liste.envies.model.UserShare;
import fr.desaintsteban.liste.envies.enums.UserShareType;
import fr.desaintsteban.liste.envies.service.AppUserService;
import fr.desaintsteban.liste.envies.service.WishListService;
import fr.desaintsteban.liste.envies.util.ServletUtils;
import fr.desaintsteban.liste.envies.util.WishRules;

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

import static java.util.stream.Collectors.toList;
import static java.util.stream.Collectors.toSet;

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
            return getAllWhishListDtosForUser(user, list);
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
            return list.stream().filter(wishList -> wishList.containsOwner(email) && (wishList.containsUser(user.getEmail()) || user.isAdmin())).map(listeEnvy -> listeEnvy.toDto(false, user, null)).collect(toList());
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
            return list.stream().map(wishList -> wishList.toDto(false, user, null)).collect(toList());
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
            return orUpdate.toDto(true, user, null);
        }
        return null;
    }

    @POST
    @Path("/")
    public WishListDto addWishList(WishListDto wishListDto) {
        final AppUser user = ServletUtils.getUserAuthenticated();
        if (user != null) {
            LOGGER.info("Add WishList " + wishListDto.getName());
            WishList wishList = WishListService.createOrUpdate(user, new WishList(wishListDto));
            return getOneWishListDtoForUser(user, wishList);
        }
        return null;
    }

    @GET
    @Path("/{name}")
    public WishListDto getOneWishListForUser(@PathParam("name") String wishName) {
        final AppUser user = ServletUtils.getUserAuthenticated();
        LOGGER.info("Get " + wishName);
        WishList wishList = WishListService.get(wishName);
        return getOneWishListDtoForUser(user, wishList);
    }

    @GET
    @Path("/{name}/join")
    public WishListDto join(@PathParam("name") String wishName) {
        final AppUser user = ServletUtils.getUserAuthenticated();
        WishList list = WishListService.get(wishName);
        if (user != null && list.getPrivacy() == SharingPrivacyType.OPEN) {
            WishListService.addUser(user, list);
            return getOneWishListDtoForUser(user, list);
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

    private WishListDto getOneWishListDtoForUser(AppUser user, WishList wishList) {
        Map<String,AppUser> map = null;
        if (wishList.getUsers() != null) {
            List<String> emails = wishList.getUsers().stream().map(UserShare::getEmail).collect(toList());
            map = AppUserService.loadAll(emails);
        }
        return wishList.toDto(true, user, map);
    }

    private List<WishListDto> getAllWhishListDtosForUser(AppUser user, List<WishList> list) {
        Set<String> emails = list.stream().flatMap(wishList -> wishList.getUsers().stream()).filter(userShare -> userShare.getType() == UserShareType.OWNER).map(UserShare::getEmail).collect(toSet());
        final Map<String,AppUser> map = AppUserService.loadAll(emails);
        return list.stream().map(wishList -> wishList.toDto(false, user, map)).collect(toList());
    }
}
