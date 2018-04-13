package fr.desaintsteban.liste.envies.servlet;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.concurrent.ExecutionException;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;

import fr.desaintsteban.liste.envies.service.AppUserService;

/**
 * AuthFilter, this filter validate the firebase auth token, create or load the AppUser.
 */
public class AuthFilter implements Filter {
    private static final Logger LOGGER = Logger.getLogger(AuthFilter.class.getName());
    private static boolean initFirebase = false;
	/**
	 * @throws IOException */
	@Override
	public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws ServletException, IOException {
		HttpServletRequest request = ((HttpServletRequest) servletRequest);
        HttpServletResponse response = ((HttpServletResponse) servletResponse);
        String authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader != null) {
            if (!authorizationHeader.startsWith("Bearer")) {
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Authorization Header must be valid");
                return;
            }
            // Extract the token
            String token = authorizationHeader.substring("Bearer".length()).trim();
            FirebaseToken decodedToken;
            try {
                //TODO: Valider le token seulement sur l'url pour récupérer les infos d'un utilisateur.
                LOGGER.info("Validate token");
                decodedToken = FirebaseAuth.getInstance().verifyIdTokenAsync(token, false).get();
                AppUserService.getAppUser(decodedToken);
            } catch (InterruptedException | ExecutionException e) {
                LOGGER.log(Level.FINE, "Forbidden access data", e);
                response.sendError(HttpServletResponse.SC_FORBIDDEN, "Forbidden");
                return;
            }
        }
        
        filterChain.doFilter(servletRequest, servletResponse);
   }

	@Override
	public void init(FilterConfig filterConfig) throws ServletException {
        LOGGER.info("AuthFilter init");
        FirebaseOptions options;
		try {
            FileInputStream serviceAccount = new FileInputStream("liste-envies-firebase.json");
            LOGGER.info("AuthFilter init after read json");
			options = new FirebaseOptions.Builder()
            .setCredentials(GoogleCredentials.fromStream(serviceAccount))
            .setDatabaseUrl("https://"+filterConfig.getInitParameter("firebaseId")+".firebaseio.com/")
            .build();
            FirebaseApp.initializeApp(options);
            LOGGER.info("Initialize firebase app");
            initFirebase = true;
		} catch (IOException e) {
            LOGGER.log(Level.FINEST, "can't Initialize firebase app", e);
		}
    }

	@Override
	public void destroy() {
		
	} 
}