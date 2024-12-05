package fr.desaintsteban.liste.envies.rest;

import com.google.api.client.googleapis.json.GoogleJsonError;
import com.google.api.client.googleapis.json.GoogleJsonResponseException;

import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

@Provider
public class AppExceptionMapper implements ExceptionMapper<GoogleJsonResponseException> {

    @Override
    public Response toResponse(GoogleJsonResponseException ex) {
        GoogleJsonError details = ex.getDetails();
        return Response.status(details.getCode())
                .entity(details.getMessage())
                .type(MediaType.APPLICATION_JSON)
                .build();
    }
}
