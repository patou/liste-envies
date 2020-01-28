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
import fr.desaintsteban.liste.envies.service.AppUserService;
import fr.desaintsteban.liste.envies.service.OfyService;
import org.junit.After;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;

import java.io.Closeable;
import java.io.IOException;
import java.util.Date;
import java.util.List;

import static org.fest.assertions.Assertions.assertThat;

public class AppUserServiceTest {
    private final LocalServiceTestHelper helper = new LocalServiceTestHelper(
            new LocalDatastoreServiceTestConfig().setApplyAllHighRepJobPolicy(),
            new LocalMemcacheServiceTestConfig(),
            new LocalTaskQueueTestConfig());
    private Closeable closable;

    @BeforeClass
    public static void setUpBeforeClass()
    {
// test labeler
        //ObjectifyService.reset();
        // Reset the Factory so that all translators work properly.
        ObjectifyService.setFactory(new ObjectifyFactory() {
            @Override
            public Objectify begin()
            {
                return super.begin().cache(false);
            }
        });
        ObjectifyService.factory().register(AppUser.class);

    }

    @Before
    public void setUp() {
        helper.setUp();
        closable = OfyService.begin();
        AppUserService.createOrUpdate(new AppUser("patrice@desaintsteban.fr", "Patrice"));
        AppUserService.createOrUpdate(new AppUser("emmanuel@desaintsteban.fr", "Emmanuel"));
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
        AppUser appUser = AppUserService.get("patrice@desaintsteban.fr");

        assertThat(appUser.getEmail()).isEqualTo("patrice@desaintsteban.fr");
        assertThat(appUser.getName()).isEqualTo("Patrice");
    }

    @Test
    public void testList() throws Exception {
        List<AppUser> list = AppUserService.list();
        assertThat(list).hasSize(2).onProperty("email").contains("patrice@desaintsteban.fr", "emmanuel@desaintsteban.fr");
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
}
