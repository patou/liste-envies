package fr.desaintsteban.liste.envies.exception;

import com.googlecode.objectify.NotFoundException;

import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

@Provider
public class WishListNotFoundExceptionMapper implements
        ExceptionMapper<NotFoundException>
{
    @Override
    public Response toResponse(NotFoundException exception)
    {
        return Response.status(Response.Status.NOT_FOUND).entity("This wish list didn't exist")
                                    .type("text/plain").build();
    }
}
