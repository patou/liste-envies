package fr.desaintsteban.liste.envies.servlet;

import com.auth0.jwt.JWT;
import com.auth0.jwt.exceptions.JWTDecodeException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import fr.desaintsteban.liste.envies.service.AppUserService;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
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
        String authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader != null) {
            if (!authorizationHeader.startsWith("Bearer")) {
                AppUserService.removeAppUser();
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Authorization Header must be valid");
                return;
            }
            // todo validate the token
            String token = authorizationHeader.substring("Bearer".length()).trim();
            try {
                DecodedJWT jwt = JWT.decode(token);
                AppUserService.getAppUserFromJwt(jwt);
            } catch (JWTDecodeException exception){
                //Invalid token
                AppUserService.removeAppUser();
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Authorization Header must be valid");
                return;
            }


            // Extract the token
            /*String token = authorizationHeader.substring("Bearer".length()).trim();

            RSAPublicKey publicKey = //Get the key instance
            RSAPrivateKey privateKey = //Get the key instance
            try {
                JCEMapper.Algorithm algorithm = Algorithm.RSA256(publicKey, privateKey);
                JWTVerifier verifier = JWT.require(algorithm)
                        .withIssuer("auth0")
                        .build(); //Reusable verifier instance
                DecodedJWT jwt = verifier.verify(token);
            } catch (JWTVerificationException exception){
                //Invalid signature/claims
            }*/
            /*FirebaseToken decodedToken;
            try {
                //TODO: Valider le token seulement sur l'url pour récupérer les infos d'un utilisateur.
                LOGGER.info("Validate token");
                decodedToken = FirebaseAuth.getInstance().verifyIdTokenAsync(token, false).get();
                AppUserService.getAppUser(decodedToken);
            } catch (InterruptedException e) {
                LOGGER.log(Level.FINER, "Interrupted verify id token", e);
                e.printStackTrace();
                response.sendError(HttpServletResponse.SC_GATEWAY_TIMEOUT, "Timeout");
                return;
            } catch (ExecutionException e) {
                LOGGER.log(Level.FINE, "Forbidden access data", e);
                e.printStackTrace();
                response.sendError(HttpServletResponse.SC_FORBIDDEN, "Forbidden");
                return;
            }*/
        } else {
            // logout if no auth
            AppUserService.removeAppUser();
        }

        filterChain.doFilter(servletRequest, servletResponse);
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
