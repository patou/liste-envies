package fr.desaintsteban.liste.envies.servlet;

import com.google.appengine.tools.development.testing.LocalServiceTestHelper;
import com.google.appengine.tools.development.testing.LocalUserServiceTestConfig;
import com.google.cloud.datastore.testing.LocalDatastoreHelper;
import com.google.firebase.ErrorCode;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import com.googlecode.objectify.ObjectifyService;
import fr.desaintsteban.liste.envies.model.AppUser;
import fr.desaintsteban.liste.envies.service.AppUserService;
import fr.desaintsteban.liste.envies.service.OfyService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.io.Closeable;
import java.io.IOException;
import java.util.concurrent.atomic.AtomicReference;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * Tests du filtre d'authentification : la vérification du jeton est substituée
 * (aucun appel réseau vers Firebase).
 */
public class AuthFilterTest {
    private static LocalDatastoreHelper datastoreHelper;
    private final LocalServiceTestHelper userServiceHelper = new LocalServiceTestHelper(new LocalUserServiceTestConfig());
    private Closeable closable;

    @BeforeAll
    public static void setUpBeforeClass() throws IOException, InterruptedException {
        System.setProperty("GOOGLE_CLOUD_PROJECT", "test-project");
        datastoreHelper = LocalDatastoreHelper.create(1.0);
        datastoreHelper.start();
        System.setProperty("DATASTORE_EMULATOR_HOST", "localhost:" + datastoreHelper.getPort());
        System.setProperty("DATASTORE_PROJECT_ID", "test-project");
        ObjectifyService.init();
        ObjectifyService.factory().register(AppUser.class);
    }

    @BeforeEach
    public void setUp() throws IOException {
        userServiceHelper.setUp();
        closable = OfyService.begin();
        datastoreHelper.reset();
    }

    @AfterEach
    public void tearDown() throws IOException {
        try {
            closable.close();
        } finally {
            userServiceHelper.tearDown();
        }
    }

    @AfterAll
    public static void tearDownAfterClass() throws IOException, InterruptedException, java.util.concurrent.TimeoutException {
        if (datastoreHelper != null) {
            datastoreHelper.stop();
        }
    }

    /** AuthFilter dont la vérification Firebase est remplacée par un stub hors réseau. */
    static class StubAuthFilter extends AuthFilter {
        private final FirebaseToken token;
        private final FirebaseAuthException exception;
        boolean verifyAppelee = false;

        StubAuthFilter(FirebaseToken token) {
            this.token = token;
            this.exception = null;
        }

        StubAuthFilter(FirebaseAuthException exception) {
            this.token = null;
            this.exception = exception;
        }

        @Override
        FirebaseToken verifyIdToken(String token) throws FirebaseAuthException {
            verifyAppelee = true;
            if (exception != null) {
                throw exception;
            }
            return this.token;
        }
    }

    private static HttpServletRequest requestWithAuthorization(String authorization) {
        HttpServletRequest request = mock(HttpServletRequest.class);
        when(request.getHeader("Authorization")).thenReturn(authorization);
        return request;
    }

    private static FirebaseToken token(String email) {
        FirebaseToken token = mock(FirebaseToken.class);
        when(token.getEmail()).thenReturn(email);
        when(token.getName()).thenReturn(email != null && email.contains("@") ? email.substring(0, email.indexOf('@')) : email);
        when(token.getIssuer()).thenReturn("https://securetoken.google.com/test-project");
        return token;
    }

    /** Chaîne qui mémorise l'utilisateur courant pendant qu'elle s'exécute. */
    private static FilterChain chainCapturant(AtomicReference<AppUser> utilisateurPendantLaChaine) {
        FilterChain chain = mock(FilterChain.class);
        try {
            doAnswer(invocation -> {
                utilisateurPendantLaChaine.set(AppUserService.getAppUser());
                return null;
            }).when(chain).doFilter(org.mockito.ArgumentMatchers.any(), org.mockito.ArgumentMatchers.any());
        } catch (Exception e) {
            throw new IllegalStateException(e);
        }
        return chain;
    }

    @Test
    public void sansEnTeteAuthorizationLaRequetePasseSansUtilisateur() throws Exception {
        AuthFilter filter = new AuthFilter();
        HttpServletRequest request = requestWithAuthorization(null);
        HttpServletResponse response = mock(HttpServletResponse.class);
        FilterChain chain = mock(FilterChain.class);

        filter.doFilter(request, response, chain);

        verify(chain).doFilter(request, response);
        verify(response, never()).sendError(anyInt(), anyString());
        assertThat(AppUserService.hasAppUser()).isFalse();
    }

    @Test
    public void enTeteNonBearerEstRejete() throws Exception {
        AuthFilter filter = new AuthFilter();
        HttpServletRequest request = requestWithAuthorization("Basic abc123");
        HttpServletResponse response = mock(HttpServletResponse.class);
        FilterChain chain = mock(FilterChain.class);

        filter.doFilter(request, response, chain);

        verify(response).sendError(HttpServletResponse.SC_UNAUTHORIZED, "Authorization Header must be valid");
        verify(chain, never()).doFilter(request, response);
        assertThat(AppUserService.hasAppUser()).isFalse();
    }

    @Test
    public void jetonRefuseParFirebaseEstRejete() throws Exception {
        FirebaseAuthException invalid = new FirebaseAuthException(ErrorCode.UNAUTHENTICATED, "bad token", null, null, null);
        StubAuthFilter filter = new StubAuthFilter(invalid);
        HttpServletRequest request = requestWithAuthorization("Bearer abc.def.ghi");
        HttpServletResponse response = mock(HttpServletResponse.class);
        FilterChain chain = mock(FilterChain.class);

        filter.doFilter(request, response, chain);

        assertThat(filter.verifyAppelee).isTrue();
        verify(response).sendError(HttpServletResponse.SC_UNAUTHORIZED, "Authorization Header must be valid");
        verify(chain, never()).doFilter(request, response);
        assertThat(AppUserService.hasAppUser()).isFalse();
    }

    @Test
    public void jetonSansEmailEstRejete() throws Exception {
        AuthFilter filter = new StubAuthFilter(token(null));
        HttpServletRequest request = requestWithAuthorization("Bearer jeton.sans.email");
        HttpServletResponse response = mock(HttpServletResponse.class);
        FilterChain chain = mock(FilterChain.class);

        filter.doFilter(request, response, chain);

        verify(response).sendError(HttpServletResponse.SC_UNAUTHORIZED, "Authorization Header must be valid");
        verify(chain, never()).doFilter(request, response);
        assertThat(AppUserService.hasAppUser()).isFalse();
    }

    @Test
    public void jetonAvecEmailVideEstRejete() throws Exception {
        AuthFilter filter = new StubAuthFilter(token("  "));
        HttpServletRequest request = requestWithAuthorization("Bearer jeton.email.vide");
        HttpServletResponse response = mock(HttpServletResponse.class);
        FilterChain chain = mock(FilterChain.class);

        filter.doFilter(request, response, chain);

        verify(response).sendError(HttpServletResponse.SC_UNAUTHORIZED, "Authorization Header must be valid");
        verify(chain, never()).doFilter(request, response);
    }





    @Test
    public void jetonVerifieChargeLUtilisateurPendantLaChainePuisNettoieLeThread() throws Exception {
        AtomicReference<AppUser> pendant = new AtomicReference<>();
        StubAuthFilter filter = new StubAuthFilter(token("nouveau@example.com"));
        HttpServletRequest request = requestWithAuthorization("Bearer jeton.signe.par.firebase");
        HttpServletResponse response = mock(HttpServletResponse.class);
        FilterChain chain = chainCapturant(pendant);

        filter.doFilter(request, response, chain);

        verify(chain).doFilter(request, response);
        verify(response, never()).sendError(anyInt(), anyString());
        // La vérification Firebase a bien été invoquée (aucun décodage sans vérification)
        assertThat(filter.verifyAppelee).isTrue();
        // L'utilisateur était présent pendant la chaîne
        assertThat(pendant.get()).isNotNull();
        assertThat(pendant.get().getEmail()).isEqualTo("nouveau@example.com");
        assertThat(pendant.get().getName()).isEqualTo("nouveau");
        // et il a été persisté par le filtre
        assertThat(AppUserService.get("nouveau@example.com")).isNotNull();
        // Le thread est nettoyé après la requête (threads mutualisés)
        assertThat(AppUserService.hasAppUser()).isFalse();
    }

    @Test
    public void threadNettoyeMemeSiLaChaineLeveUneException() {
        AuthFilter filter = new StubAuthFilter(token("nouveau@example.com"));
        HttpServletRequest request = requestWithAuthorization("Bearer jeton.signe.par.firebase");
        HttpServletResponse response = mock(HttpServletResponse.class);
        FilterChain chain = (req, res) -> {
            throw new ServletException("panne en aval");
        };

        assertThrows(ServletException.class, () -> filter.doFilter(request, response, chain));
        assertThat(AppUserService.hasAppUser()).isFalse();
    }

    @Test
    public void adminExistantEstPreserveALaConnexion() throws Exception {
        AppUser admin = new AppUser("admin@example.com", "Admin");
        admin.setIsAdmin(true);
        AppUserService.createOrUpdate(admin);

        AtomicReference<AppUser> pendant = new AtomicReference<>();
        AuthFilter filter = new StubAuthFilter(token("admin@example.com"));
        HttpServletRequest request = requestWithAuthorization("Bearer jeton.admin");
        HttpServletResponse response = mock(HttpServletResponse.class);
        FilterChain chain = chainCapturant(pendant);

        filter.doFilter(request, response, chain);

        verify(chain).doFilter(request, response);
        // Le jeton ne doit jamais rétrograder un admin : la donnée serveur est conservée
        assertThat(pendant.get().isAdmin()).isTrue();
        assertThat(AppUserService.get("admin@example.com").isAdmin()).isTrue();
    }

    @Test
    public void utilisateurExistantNonAdminNeDevientPasAdmin() throws Exception {
        AppUserService.createOrUpdate(new AppUser("lambda@example.com", "Lambda"));

        AtomicReference<AppUser> pendant = new AtomicReference<>();
        AuthFilter filter = new StubAuthFilter(token("lambda@example.com"));
        HttpServletRequest request = requestWithAuthorization("Bearer jeton.lambda");
        HttpServletResponse response = mock(HttpServletResponse.class);
        FilterChain chain = chainCapturant(pendant);

        filter.doFilter(request, response, chain);

        verify(chain).doFilter(request, response);
        assertThat(pendant.get().isAdmin()).isFalse();
        assertThat(AppUserService.get("lambda@example.com").isAdmin()).isFalse();
    }
}
