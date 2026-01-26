package fr.desaintsteban.liste.envies.exception;

import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;
import java.util.logging.Logger;

@Provider
public class UncaughtException extends Throwable implements ExceptionMapper<Throwable>
{
    private static final long serialVersionUID = 1L;
    private static final Logger LOGGER = Logger.getLogger(UncaughtException.class.getName());

    @Override
    public Response toResponse(Throwable exception)
    {
        LOGGER.severe("Uncaught exception: " + exception.getMessage());
        for (StackTraceElement element : exception.getStackTrace()) {
            LOGGER.severe(element.toString());
        }
        return Response.status(500).entity("Something bad happened. Please try again !!").type("text/plain").build();
    }
}
