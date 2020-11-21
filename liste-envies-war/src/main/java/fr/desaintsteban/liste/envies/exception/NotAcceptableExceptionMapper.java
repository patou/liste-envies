package fr.desaintsteban.liste.envies.exception;

import javax.ws.rs.core.Response;
import javax.ws.rs.ext.ExceptionMapper;
import javax.ws.rs.ext.Provider;

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
