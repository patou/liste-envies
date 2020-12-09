package fr.desaintsteban.liste.envies.exception;

import javax.ws.rs.core.Response;
import javax.ws.rs.ext.ExceptionMapper;
import javax.ws.rs.ext.Provider;

@Provider
public class NotLoggedExceptionMapper implements
        ExceptionMapper<NotLoggedException>
{
    @Override
    public Response toResponse(NotLoggedException exception)
    {
        return Response.status(Response.Status.UNAUTHORIZED).entity(exception.getMessage())
                                    .type("text/plain").build();
    }
}
