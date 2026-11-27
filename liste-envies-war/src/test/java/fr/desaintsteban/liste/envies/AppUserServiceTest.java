package fr.desaintsteban.liste.envies;

import com.google.appengine.tools.development.testing.LocalDatastoreServiceTestConfig;
import com.google.appengine.tools.development.testing.LocalMemcacheServiceTestConfig;
import com.google.appengine.tools.development.testing.LocalServiceTestHelper;
import com.google.appengine.tools.development.testing.LocalTaskQueueTestConfig;
import com.googlecode.objectify.ObjectifyService;
import fr.desaintsteban.liste.envies.model.AppUser;
import fr.desaintsteban.liste.envies.service.AppUserService;
import fr.desaintsteban.liste.envies.service.OfyService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.io.Closeable;
import java.io.IOException;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import com.google.cloud.datastore.testing.LocalDatastoreHelper;

public class AppUserServiceTest {
    private static LocalDatastoreHelper datastoreHelper;
    private Closeable closable;

    @BeforeAll
    public static void setUpBeforeClass() throws IOException, InterruptedException {
        System.setProperty("GOOGLE_CLOUD_PROJECT", "test-project");

        // Start local Datastore emulator
        datastoreHelper = LocalDatastoreHelper.create(1.0);
        datastoreHelper.start();

        // Configure Objectify to use the local emulator
        System.setProperty("DATASTORE_EMULATOR_HOST", "localhost:" + datastoreHelper.getPort());
        System.setProperty("DATASTORE_PROJECT_ID", "test-project");

        // ObjectifyService.reset();
        ObjectifyService.init();
        ObjectifyService.factory().register(AppUser.class);
    }

    @BeforeEach
    public void setUp() throws IOException {
        closable = OfyService.begin();
        datastoreHelper.reset();
        AppUserService.createOrUpdate(new AppUser("patrice@desaintsteban.fr", "Patrice"));
        AppUserService.createOrUpdate(new AppUser("emmanuel@desaintsteban.fr", "Emmanuel"));
    }

    @AfterEach
    public void tearDown() throws IOException, InterruptedException, java.util.concurrent.TimeoutException {
        try {
            closable.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @org.junit.jupiter.api.AfterAll
    public static void tearDownAfterClass()
            throws IOException, InterruptedException, java.util.concurrent.TimeoutException {
        if (datastoreHelper != null) {
            datastoreHelper.stop();
        }
    }

    @Test
    public void testGet() throws Exception {
        AppUser appUser = AppUserService.get("patrice@desaintsteban.fr");

        assertThat(appUser.getEmail()).isEqualTo("patrice@desaintsteban.fr");
        assertThat(appUser.getName()).isEqualTo("Patrice");
    }

    @Test
    public void testList() throws Exception {
        List<AppUser> list = AppUserService.list();
        assertThat(list).extracting("email").hasSize(2).contains("patrice@desaintsteban.fr",
                "emmanuel@desaintsteban.fr");
    }

    @Test
    public void testCreate() throws Exception {
        AppUserService.createOrUpdate(new AppUser("clemence@desaintsteban.fr", "Clemence"));
    }

    @Test
    public void testDelete() throws Exception {
        AppUserService.delete("patrice@desaintsteban.fr");

        AppUser appUser = AppUserService.get("patrice@desaintsteban.fr");
        assertThat(appUser).isNull();
    }

    @Test
    public void getAppUserFromJwtWithoutNameClaim() {
        // Compte email/mot de passe Firebase sans displayName : pas de claim "name" ni "picture"
        String token = com.auth0.jwt.JWT.create()
                .withClaim("email", "sans-nom@example.com")
                .withClaim("iss", "https://securetoken.google.com/test")
                .sign(com.auth0.jwt.algorithms.Algorithm.HMAC256("secret"));
        AppUser appUser = AppUserService.getAppUserFromJwt(com.auth0.jwt.JWT.decode(token));
        assertThat(appUser).isNotNull();
        assertThat(appUser.getEmail()).isEqualTo("sans-nom@example.com");
        assertThat(appUser.getName()).isEqualTo("sans-nom");
        // deuxième connexion du même compte (utilisateur déjà en base)
        assertThat(AppUserService.getAppUserFromJwt(com.auth0.jwt.JWT.decode(token))).isNotNull();
    }

    @Test
    public void getAppUserFromJwtWithNameClaim() {
        String token = com.auth0.jwt.JWT.create()
                .withClaim("email", "avec-nom@example.com")
                .withClaim("name", "Avec Nom")
                .withClaim("picture", "https://example.com/p.png")
                .withClaim("iss", "https://securetoken.google.com/test")
                .sign(com.auth0.jwt.algorithms.Algorithm.HMAC256("secret"));
        AppUser appUser = AppUserService.getAppUserFromJwt(com.auth0.jwt.JWT.decode(token));
        assertThat(appUser.getName()).isEqualTo("Avec Nom");
        assertThat(appUser.getPicture()).isEqualTo("https://example.com/p.png");
    }
}
