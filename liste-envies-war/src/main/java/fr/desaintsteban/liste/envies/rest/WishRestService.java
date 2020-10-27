package fr.desaintsteban.liste.envies.rest;

import fr.desaintsteban.liste.envies.dto.CommentDto;
import fr.desaintsteban.liste.envies.dto.WishDto;
import fr.desaintsteban.liste.envies.model.AppUser;
import fr.desaintsteban.liste.envies.model.Wish;
import fr.desaintsteban.liste.envies.service.WishesService;
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
        final AppUser user = ServletUtils.getUserAuthenticated();
        LOGGER.info("Get " + id);
        return WishesService.get(user, name, id);
    }

    @PUT
    @Path("/give/{id}")
    public WishDto give(@PathParam("name") String name, @PathParam("id") Long id) {
        final AppUser user = ServletUtils.getUserAuthenticated();
        if (user != null){
            LOGGER.info("Give " + id);
            return WishesService.give(user, name, id);
        }
        return null;
    }


    @DELETE
    @Path("/give/{id}")
    public WishDto cancel(@PathParam("name") String name, @PathParam("id") Long id) {
        final AppUser user = ServletUtils.getUserAuthenticated();
        if (user != null){
            LOGGER.info("Cancel " + id);
            return WishesService.cancel(user, name, id);
        }
        return null;
    }

    @GET
    public List<WishDto> getWish(@PathParam("name") String name) {
        final AppUser user = ServletUtils.getUserAuthenticated();
        LOGGER.info("List");
        return WishesService.list(user, name, false);
    }

    /**
     * Get archived wish for a list
     * @param name
     * @return
     */
    @GET
    @Path("/archived")
    public List<WishDto> getArchivedWish(@PathParam("name") String name) {
        final AppUser user = ServletUtils.getUserAuthenticated();
        LOGGER.info("List archived");
        return WishesService.listArchived(user, name);
    }

    @POST
    public WishDto addwish(@PathParam("name") String name, WishDto wishDto) {
        final AppUser user = ServletUtils.getUserAuthenticated();
        if (user != null) {
            LOGGER.info("Put " + wishDto.getLabel());
            return WishesService.createOrUpdate(user, name, new Wish(wishDto));
        }
        return null;
    }

    @POST
    @Path("/{id}/addComment")
    public WishDto addComment(@PathParam("name") String name, @PathParam("id") Long wishId, CommentDto comment) {
        final AppUser user = ServletUtils.getUserAuthenticated();
        if (user != null) {
            LOGGER.info("add comment from " + user.getName()+"wish id : "+wishId+" Comment : "+comment.getText());
            WishDto wishDto = WishesService.addComment(user, wishId, name, comment);
            if (wishDto != null) {
                LOGGER.info("Updated wish with comments " + wishDto.getLabel());
            }
            return wishDto;
        }
        return null;
    }

    @POST
    @Path("/{id}")
    public WishDto updateWish(@PathParam("name") String name, WishDto wishDto) {
        final AppUser user = ServletUtils.getUserAuthenticated();
        if (user != null) {
            LOGGER.info("Put " + wishDto.getLabel());
            return WishesService.createOrUpdate(user, name, new Wish(wishDto));
        }
        return wishDto;
    }

    @DELETE
    @Path("/{id}")
    public void deleteWish(@PathParam("name") String name, @PathParam("id") Long id){
        final AppUser user = ServletUtils.getUserAuthenticated();
        if(user != null){
            LOGGER.info("Delete " + id);
            WishesService.delete(user, name, id);
        }
    }

    @PUT
    @Path("/archive/{id}")
    public void archiveWish(@PathParam("name") String name, @PathParam("id") Long id){
        final AppUser user = ServletUtils.getUserAuthenticated();
        if(user != null){
            LOGGER.info("Archive " + id);
            WishesService.archive(user, name, id);
        }
    }
}
