package fr.desaintsteban.liste.envies.exception;

import com.googlecode.objectify.NotFoundException;

import javax.ws.rs.core.Response;
import javax.ws.rs.ext.ExceptionMapper;
import javax.ws.rs.ext.Provider;

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
