package fr.desaintsteban.liste.envies.exception;

import com.googlecode.objectify.NotFoundException;

import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

@Provider
public class NotAllowedExceptionMapper implements
        ExceptionMapper<NotAllowedException>
{
    @Override
    public Response toResponse(NotAllowedException exception)
    {
        return Response.status(Response.Status.FORBIDDEN).entity(exception.getMessage())
                                    .type("text/plain").build();
    }
}
