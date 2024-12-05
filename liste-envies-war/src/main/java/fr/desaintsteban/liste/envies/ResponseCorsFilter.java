package fr.desaintsteban.liste.envies;

import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerResponseContext;
import jakarta.ws.rs.container.ContainerResponseFilter;
import jakarta.ws.rs.ext.Provider;
import java.io.IOException;

@Provider
public class ResponseCorsFilter implements ContainerResponseFilter {

    @Override
    public void filter(ContainerRequestContext requestContext, ContainerResponseContext responseContext) throws IOException {
        // Ajouter les en-têtes CORS
        responseContext.getHeaders().add("Access-Control-Allow-Origin", "*");
        responseContext.getHeaders().add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

        String reqHead = requestContext.getHeaderString("Access-Control-Request-Headers");

        if (reqHead != null && !reqHead.isEmpty()) {
            responseContext.getHeaders().add("Access-Control-Allow-Headers", reqHead);
        }
    }
}