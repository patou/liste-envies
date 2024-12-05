package fr.desaintsteban.liste.envies.rest;

import fr.desaintsteban.liste.envies.dto.CommentDto;
import fr.desaintsteban.liste.envies.dto.WishDto;
import fr.desaintsteban.liste.envies.enums.WishState;
import fr.desaintsteban.liste.envies.model.AppUser;
import fr.desaintsteban.liste.envies.model.Wish;
import fr.desaintsteban.liste.envies.service.WishesService;
import fr.desaintsteban.liste.envies.util.ServletUtils;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;

import java.util.List;
import java.util.logging.Logger;

@Path("/wishes/{name}")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class WishRestService {
    private static final Logger LOGGER = Logger.getLogger(WishRestService.class.getName());

    @GET
    @Path("/{id}")
    public WishDto getWish(@PathParam("name") String name, @PathParam("id") Long id) {
        AppUser user = ServletUtils.getUserConnected();
        LOGGER.info("Get " + id);
        return WishesService.get(user, name, id);
    }

    @PUT
    @Path("/give/{id}")
    public WishDto give(@PathParam("name") String name, @PathParam("id") Long id) {
        AppUser user = ServletUtils.getUserConnected();
        LOGGER.info("Give " + id);
        return WishesService.give(user, name, id);
    }

    @DELETE
    @Path("/give/{id}")
    public WishDto cancel(@PathParam("name") String name, @PathParam("id") Long id) {
        AppUser user = ServletUtils.getUserConnected();
        LOGGER.info("Cancel " + id);
        return WishesService.cancel(user, name, id);
    }

    @GET
    public List<WishDto> getWishes(@PathParam("name") String name) {
        AppUser user = ServletUtils.isUserConnected() ? ServletUtils.getUserConnected() : null;
        LOGGER.info("List");
        return WishesService.list(user, name, WishState.ACTIVE);
    }

    @GET
    @Path("/archived")
    public List<WishDto> getArchivedWishes(@PathParam("name") String name) {
        AppUser user = ServletUtils.getUserConnected();
        LOGGER.info("List archived");
        return WishesService.listArchived(user, name);
    }

    @POST
    public WishDto addWish(@PathParam("name") String name, WishDto wishDto) {
        AppUser user = ServletUtils.getUserConnected();
        LOGGER.info("Put " + wishDto.getLabel());
        return WishesService.createOrUpdate(user, name, new Wish(wishDto));
    }

    @POST
    @Path("/{id}/addComment")
    public WishDto addComment(@PathParam("name") String name, @PathParam("id") Long wishId, CommentDto comment) {
        AppUser user = ServletUtils.getUserConnected();
        LOGGER.info("Add comment from " + user.getName() + " wish id: " + wishId + " Comment: " + comment.getText());
        WishDto wishDto = WishesService.addComment(user, wishId, name, comment);
        LOGGER.info("Updated wish with comments " + wishDto.getLabel());
        return wishDto;
    }

    @POST
    @Path("/{id}")
    public WishDto updateWish(@PathParam("name") String name, WishDto wishDto) {
        AppUser user = ServletUtils.getUserConnected();
        LOGGER.info("Put " + wishDto.getLabel());
        return WishesService.createOrUpdate(user, name, new Wish(wishDto));
    }

    @DELETE
    @Path("/{id}")
    public void deleteWish(@PathParam("name") String name, @PathParam("id") Long id) {
        AppUser user = ServletUtils.getUserConnected();
        LOGGER.info("Delete " + id);
        WishesService.delete(user, name, id);
    }

    @PUT
    @Path("/archive/{id}")
    public void archiveWish(@PathParam("name") String name, @PathParam("id") Long id) {
        AppUser user = ServletUtils.getUserConnected();
        LOGGER.info("Archive " + id);
        WishesService.archive(user, name, id);
    }
}
