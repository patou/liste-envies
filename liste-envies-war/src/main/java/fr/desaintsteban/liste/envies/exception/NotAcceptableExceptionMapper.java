package fr.desaintsteban.liste.envies.exception;

import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

@Provider
public class NotAcceptableExceptionMapper implements
        ExceptionMapper<NotAllowedException>
{
    @Override
    public Response toResponse(NotAllowedException exception)
    {
        return Response.status(Response.Status.NOT_ACCEPTABLE).entity(exception.getMessage())
                                    .type("text/plain").build();
    }
}
