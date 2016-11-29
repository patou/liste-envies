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
import fr.desaintsteban.liste.envies.model.Envie;
import fr.desaintsteban.liste.envies.service.AppUserService;
import fr.desaintsteban.liste.envies.service.EnviesService;
import fr.desaintsteban.liste.envies.service.OfyService;
import org.junit.After;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;

import java.io.Closeable;
import java.io.IOException;
import java.util.List;

import static org.fest.assertions.Assertions.assertThat;

public class EnvieServiceTest {
    private final LocalServiceTestHelper helper = new LocalServiceTestHelper(
            new LocalDatastoreServiceTestConfig().setApplyAllHighRepJobPolicy(),
            new LocalMemcacheServiceTestConfig(),
            new LocalTaskQueueTestConfig());
    private Closeable closable;
    private AppUser patrice;
    private Long livreId;
    private Long dvdId;
    private AppUser emmanuel;

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

    }

    @Before
    public void setUp() {
        helper.setUp();
        closable = ObjectifyService.begin();
        OfyService.factory();
        patrice = new AppUser("patrice@desaintsteban.fr", "Patrice");
        AppUserService.createOrUpdate(patrice);
        emmanuel = new AppUser("emmanuel@desaintsteban.fr", "Emmanuel");
        AppUserService.createOrUpdate(emmanuel);
        Envie itemLivre = EnviesService.createOrUpdate(patrice, "patrice@desaintsteban.fr", new Envie(patrice, "Livre"));
        livreId = itemLivre.getId();
        Envie itemDvd = EnviesService.createOrUpdate(patrice, "patrice@desaintsteban.fr", new Envie(patrice, "DVD"));
        dvdId = itemDvd.getId();
        EnviesService.given(emmanuel, "patrice@desaintsteban.fr", livreId);
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
    public void testGetSameUser() throws Exception {
        Envie envie = EnviesService.get(patrice, "patrice@desaintsteban.fr", livreId);
        assertThat(envie.getLabel()).isEqualTo("Livre");
        assertThat(envie.getUserTake()).isNull();
    }

    @Test
    public void testGetNotSameUser() throws Exception {
        Envie envie = EnviesService.get(emmanuel, "patrice@desaintsteban.fr", livreId);
        assertThat(envie.getLabel()).isEqualTo("Livre");
        assertThat(envie.getUserTake()).isEqualTo("emmanuel@desaintsteban.fr");
    }

    @Test
    public void testList() throws Exception {
        List<Envie> list = EnviesService.list(patrice, "patrice@desaintsteban.fr");
        assertThat(list).hasSize(2).onProperty("label").contains("Livre", "DVD");
        assertThat(list).hasSize(2).onProperty("userTake").excludes("emmanuel@desaintsteban.fr");
    }

    @Test
    public void testListOther() throws Exception {
        List<Envie> list = EnviesService.list(emmanuel, "patrice@desaintsteban.fr");
        assertThat(list).hasSize(2).onProperty("label").contains("Livre", "DVD");
        assertThat(list).hasSize(2).onProperty("userTake").contains("emmanuel@desaintsteban.fr");
    }

    @Test
    public void testCreate() throws Exception {
        Envie itemDvd = EnviesService.createOrUpdate(emmanuel, "emmanuel@desaintsteban.fr", new Envie(emmanuel, "DVD"));
    }

    @Test
    public void testDelete() throws Exception {
        EnviesService.delete(patrice, "patrice@desaintsteban.fr", livreId);
    }
}