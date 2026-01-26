package fr.desaintsteban.liste.envies;

import com.google.cloud.datastore.testing.LocalDatastoreHelper;
import com.googlecode.objectify.ObjectifyService;
import fr.desaintsteban.liste.envies.model.AppUser;
import fr.desaintsteban.liste.envies.model.Notification;
import fr.desaintsteban.liste.envies.model.Wish;
import fr.desaintsteban.liste.envies.model.WishList;
import fr.desaintsteban.liste.envies.service.OfyService;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;

import java.io.Closeable;
import java.io.IOException;

/**
 * Base class for tests that need Datastore emulator.
 * Manages a single shared LocalDatastoreHelper instance across all test
 * classes.
 */
public abstract class BaseDatastoreTest {
    private static LocalDatastoreHelper datastoreHelper;
    private static boolean initialized = false;
    protected Closeable closable;

    @BeforeAll
    public static synchronized void setUpDatastore() throws IOException, InterruptedException {
        if (!initialized) {
            System.setProperty("GOOGLE_CLOUD_PROJECT", "test-project");

            // Start local Datastore emulator
            datastoreHelper = LocalDatastoreHelper.create(1.0);
            datastoreHelper.start();

            // Configure Objectify to use the local emulator
            System.setProperty("DATASTORE_EMULATOR_HOST", "localhost:" + datastoreHelper.getPort());
            System.setProperty("DATASTORE_PROJECT_ID", "test-project");

            // Initialize Objectify
            ObjectifyService.init();
            ObjectifyService.factory().register(AppUser.class);
            ObjectifyService.factory().register(Wish.class);
            ObjectifyService.factory().register(WishList.class);
            ObjectifyService.factory().register(Notification.class);

            initialized = true;
        }
    }

    @BeforeEach
    public void setUpTest() throws IOException {
        datastoreHelper.reset();
        closable = OfyService.begin();
    }

    @AfterEach
    public void tearDownTest() {
        try {
            if (closable != null) {
                closable.close();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @AfterAll
    public static synchronized void tearDownDatastore()
            throws IOException, InterruptedException, java.util.concurrent.TimeoutException {
        // Don't stop the emulator - let it run for all test classes
        // It will be cleaned up when the JVM exits
    }
}
