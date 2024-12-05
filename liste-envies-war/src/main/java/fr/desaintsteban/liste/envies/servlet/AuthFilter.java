package fr.desaintsteban.liste.envies.servlet;

import com.auth0.jwt.JWT;
import com.auth0.jwt.exceptions.JWTDecodeException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import fr.desaintsteban.liste.envies.service.AppUserService;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.FilterConfig;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.io.InputStream;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * AuthFilter: Validates Firebase auth token and manages AppUser.
 */
public class AuthFilter implements Filter {

    private static final Logger LOGGER = Logger.getLogger(AuthFilter.class.getName());
    private static boolean firebaseInitialized = false;

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain)
            throws IOException, ServletException {

        HttpServletRequest request = (HttpServletRequest) servletRequest;
        HttpServletResponse response = (HttpServletResponse) servletResponse;
        String authorizationHeader = request.getHeader("Authorization");

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String token = authorizationHeader.substring("Bearer".length()).trim();
            try {
                // Decode and validate JWT token
                DecodedJWT jwt = JWT.decode(token);
                AppUserService.getAppUserFromJwt(jwt); // Load or create AppUser
            } catch (JWTDecodeException e) {
                LOGGER.log(Level.WARNING, "Invalid JWT token", e);
                AppUserService.removeAppUser();
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid Authorization Token");
                return;
            }
        } else {
            LOGGER.info("No Authorization header provided, logging out user.");
            AppUserService.removeAppUser();
        }

        filterChain.doFilter(servletRequest, servletResponse);
    }

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        LOGGER.info("Initializing AuthFilter...");
        try (InputStream serviceAccount = this.getClass().getResourceAsStream("/firebase.json")) {

            if (serviceAccount == null) {
                throw new IOException("Firebase configuration file 'firebase.json' not found");
            }

            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .setDatabaseUrl("https://" + filterConfig.getInitParameter("firebaseId") + ".firebaseio.com/")
                    .build();

            synchronized (AuthFilter.class) { // Ensure thread-safe initialization
                if (FirebaseApp.getApps().isEmpty()) {
                    FirebaseApp.initializeApp(options);
                    LOGGER.info("Firebase app initialized successfully.");
                    firebaseInitialized = true;
                } else {
                    LOGGER.info("Firebase app is already initialized.");
                }
            }
        } catch (IOException e) {
            LOGGER.log(Level.SEVERE, "Failed to initialize Firebase", e);
            throw new ServletException("Firebase initialization failed", e);
        }
    }

    @Override
    public void destroy() {
        LOGGER.info("AuthFilter destroyed.");
    }
}
