package fr.desaintsteban.liste.envies.exception;

import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

@Provider
public class UncaughtException extends Throwable implements ExceptionMapper<Throwable>
{
    private static final long serialVersionUID = 1L;

    @Override
    public Response toResponse(Throwable exception)
    {
        return Response.status(500).entity("Something bad happened. Please try again !!").type("text/plain").build();
    }
}
