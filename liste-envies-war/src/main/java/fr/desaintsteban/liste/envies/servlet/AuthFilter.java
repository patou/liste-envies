package fr.desaintsteban.liste.envies.servlet;

import java.io.IOException;
import java.util.concurrent.ExecutionException;

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
                decodedToken = FirebaseAuth.getInstance().verifyIdTokenAsync(token, true).get();
                AppUserService.getAppUser(decodedToken);
            } catch (InterruptedException | ExecutionException e) {
                e.printStackTrace();
                response.sendError(HttpServletResponse.SC_FORBIDDEN, "Forbidden");
                return;
            }
        }
        
        filterChain.doFilter(servletRequest, servletResponse);
   }

	@Override
	public void init(FilterConfig filterConfig) throws ServletException {

        FirebaseOptions options;
		try {
			options = new FirebaseOptions.Builder()
            .setCredentials(GoogleCredentials.getApplicationDefault())
            .setDatabaseUrl("https://liste-envies.firebaseio.com/")
            .build();
            FirebaseApp.initializeApp(options);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	@Override
	public void destroy() {
		
	} 
}