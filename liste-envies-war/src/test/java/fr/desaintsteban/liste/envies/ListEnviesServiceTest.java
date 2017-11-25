package fr.desaintsteban.liste.envies;

import com.google.appengine.tools.development.testing.LocalDatastoreServiceTestConfig;
import com.google.appengine.tools.development.testing.LocalMemcacheServiceTestConfig;
import com.google.appengine.tools.development.testing.LocalServiceTestHelper;
import com.google.appengine.tools.development.testing.LocalTaskQueueTestConfig;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyFactory;
import com.googlecode.objectify.ObjectifyService;
import com.googlecode.objectify.cache.AsyncCacheFilter;
import fr.desaintsteban.liste.envies.model.AppUser;
import fr.desaintsteban.liste.envies.model.ListEnvies;
import fr.desaintsteban.liste.envies.model.Notification;
import fr.desaintsteban.liste.envies.service.ListEnviesService;
import fr.desaintsteban.liste.envies.service.OfyService;
import org.junit.After;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;

import java.io.Closeable;
import java.io.IOException;
import java.util.List;

import static org.fest.assertions.Assertions.assertThat;

public class ListEnviesServiceTest {
    private final LocalServiceTestHelper helper = new LocalServiceTestHelper(
            new LocalDatastoreServiceTestConfig().setApplyAllHighRepJobPolicy(),
            new LocalMemcacheServiceTestConfig(),
            new LocalTaskQueueTestConfig());
    private Closeable closable;
    private AppUser patrice;

    @BeforeClass
    public static void setUpBeforeClass()
    {

        //ObjectifyService.reset();
        // Reset the Factory so that all translators work properly.
        ObjectifyService.setFactory(new ObjectifyFactory() {
            @Override
            public Objectify begin()
            {
                return super.begin().cache(false);
            }
        });
        ObjectifyService.factory().register(ListEnvies.class);
        ObjectifyService.factory().register(AppUser.class);
        ObjectifyService.factory().register(Notification.class);

    }

    @Before
    public void setUp() {
        helper.setUp();
        closable = OfyService.begin();
        patrice = new AppUser("patrice@desaintsteban.fr", "Patrice");
        ListEnviesService.createOrUpdate(patrice, new ListEnvies("liste-patrice", "Liste de Patrice", "patrice@desaintsteban.fr", "emmanuel@desaintsteban.fr"));
        ListEnviesService.createOrUpdate(patrice, new ListEnvies("liste-emmanuel", "Liste de Emmanuel", "emmanuel@desaintsteban.fr"));
    }

    @After
    public void tearDown() {
        helper.tearDown();
        AsyncCacheFilter.complete();
        try {
            closable.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    @Test
    public void testGet() throws Exception {
        ListEnvies listEnvies = ListEnviesService.get("liste-patrice");

        assertThat(listEnvies.getName()).isEqualTo("liste-patrice");
        assertThat(listEnvies.getTitle()).isEqualTo("Liste de Patrice");
    }

    @Test
    public void testList() throws Exception {
        List<ListEnvies> list = ListEnviesService.list();
        assertThat(list).hasSize(2).onProperty("name").contains("liste-patrice", "liste-emmanuel");
    }

    @Test
    public void testListEmails() throws Exception {
        List<ListEnvies> list = ListEnviesService.list("patrice@desaintsteban.fr");
        assertThat(list).hasSize(1).onProperty("name").contains("liste-patrice");
    }

    @Test
    public void testCreate() throws Exception {
        ListEnviesService.createOrUpdate(patrice, new ListEnvies("liste-clemence", "Clemence", "clemence@desaintsteban.fr", "patrice@desaintsteban.fr", "emmanuel@desaintsteban.fr"));
    }

    @Test
    public void testDelete() throws Exception {
        ListEnviesService.delete("liste-patrice");

        ListEnvies listEnvies = ListEnviesService.get("liste-patrice");
        assertThat(listEnvies).isNull();
    }
}
