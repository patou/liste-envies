package fr.desaintsteban.liste.envies.exception;

import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

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
