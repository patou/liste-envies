package fr.desaintsteban.liste.envies.servlet;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
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
        try {
            String authorizationHeader = request.getHeader("Authorization");
            if (authorizationHeader != null) {
                if (!authorizationHeader.startsWith("Bearer")) {
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Authorization Header must be valid");
                    return;
                }
                String token = authorizationHeader.substring("Bearer".length()).trim();
                try {
                    // Vérifie la signature, l'expiration, l'émetteur et l'audience du jeton Firebase.
                    FirebaseToken decodedToken = verifyIdToken(token);
                    String email = decodedToken.getEmail();
                    if (email == null || email.trim().isEmpty()) {
                        // Jeton valide sans identité exploitable : on refuse plutôt que de poursuivre sans utilisateur.
                        response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Authorization Header must be valid");
                        return;
                    }
                    AppUserService.getAppUser(decodedToken);
                } catch (FirebaseAuthException | IllegalArgumentException exception){
                    // Jeton invalide, expiré ou non signé par Firebase
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Authorization Header must be valid");
                    return;
                }
            }

            filterChain.doFilter(servletRequest, servletResponse);
        } finally {
            // Ne jamais laisser d'utilisateur sur le thread (threads mutualisés) : anonyme, erreur ou exception aval.
            AppUserService.removeAppUser();
        }
   }


    /**
     * Vérification du jeton auprès de Firebase Auth. Méthode séparée pour être substituée dans les tests.
     */
    FirebaseToken verifyIdToken(String token) throws FirebaseAuthException {
        return FirebaseAuth.getInstance().verifyIdToken(token);
    }

	@SuppressWarnings("RedundantThrows")
    @Override
	public void init(FilterConfig filterConfig) throws ServletException {
        LOGGER.info("AuthFilter init");
        FirebaseOptions options;
		try {
            InputStream serviceAccount = this.getClass().getResourceAsStream("/firebase.json");
            LOGGER.info("AuthFilter init after read json");
			options = new FirebaseOptions.Builder()
            .setCredentials(GoogleCredentials.fromStream(serviceAccount))
            .setDatabaseUrl("https://"+filterConfig.getInitParameter("firebaseId")+".firebaseio.com/")
            .build();
            if(FirebaseApp.getApps().isEmpty()) { //<--- check with this line
                FirebaseApp.initializeApp(options);
                LOGGER.info("Initialize firebase app");
                initFirebase = true;
            } else {
                LOGGER.info("firebase app is already initialized");
                initFirebase = false;
            }


		} catch (IOException e) {
            LOGGER.log(Level.FINEST, "can't Initialize firebase app", e);
            e.printStackTrace();
		}
    }

	@Override
	public void destroy() {

	}
}
