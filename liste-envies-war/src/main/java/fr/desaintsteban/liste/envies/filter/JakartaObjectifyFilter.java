package fr.desaintsteban.liste.envies.filter;

import com.googlecode.objectify.ObjectifyService;
import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.FilterConfig;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import java.io.IOException;

/**
 * A Jakarta Servlet compatible filter for Objectify.
 * Replaces com.googlecode.objectify.ObjectifyFilter which is javax.servlet
 * based.
 */
public class JakartaObjectifyFilter implements Filter {

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        // No initialization needed
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        try (var closeable = ObjectifyService.begin()) {
            chain.doFilter(request, response);
        }
    }

    @Override
    public void destroy() {
        // No cleanup needed
    }
}
