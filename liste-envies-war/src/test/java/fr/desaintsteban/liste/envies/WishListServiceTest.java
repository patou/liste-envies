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
import fr.desaintsteban.liste.envies.model.WishList;
import fr.desaintsteban.liste.envies.model.Notification;
import fr.desaintsteban.liste.envies.service.WishListService;
import fr.desaintsteban.liste.envies.service.OfyService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.io.Closeable;
import java.io.IOException;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.extractProperty;

public class WishListServiceTest {
    private final LocalServiceTestHelper helper = new LocalServiceTestHelper(
            new LocalDatastoreServiceTestConfig().setApplyAllHighRepJobPolicy(),
            new LocalMemcacheServiceTestConfig(),
            new LocalTaskQueueTestConfig());
    private Closeable closable;
    private AppUser patrice;

    @BeforeAll
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
        ObjectifyService.factory().register(WishList.class);
        ObjectifyService.factory().register(AppUser.class);
        ObjectifyService.factory().register(Notification.class);

    }

    @BeforeEach
    public void setUp() {
        helper.setUp();
        closable = OfyService.begin();
        patrice = new AppUser("patrice@desaintsteban.fr", "Patrice");
        WishListService.createOrUpdate(patrice, new WishList("liste-patrice", "Liste de Patrice", "patrice@desaintsteban.fr", "emmanuel@desaintsteban.fr"));
        WishListService.createOrUpdate(patrice, new WishList("liste-emmanuel", "Liste de Emmanuel", "emmanuel@desaintsteban.fr"));
    }

    @AfterEach
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
        WishList wishList = WishListService.get("liste-patrice");

        assertThat(wishList.getName()).isEqualTo("liste-patrice");
        assertThat(wishList.getTitle()).isEqualTo("Liste de Patrice");
    }

    @Test
    public void testList() throws Exception {
        List<WishList> list = WishListService.list();
        assertThat(extractProperty("name").from(list)).hasSize(2).contains("liste-patrice", "liste-emmanuel");
    }

    @Test
    public void testListEmails() throws Exception {
        List<WishList> list = WishListService.list("patrice@desaintsteban.fr");
        assertThat(extractProperty("name").from(list)).hasSize(1).contains("liste-patrice");
    }

    @Test
    public void testCreate() throws Exception {
        WishListService.createOrUpdate(patrice, new WishList("liste-clemence", "Clemence", "clemence@desaintsteban.fr", "patrice@desaintsteban.fr", "emmanuel@desaintsteban.fr"));
    }

    @Test
    public void testDelete() throws Exception {
        WishListService.delete("liste-patrice");

        WishList wishList = WishListService.get("liste-patrice");
        assertThat(wishList).isNull();
    }

    @Test
    public void testRename() throws Exception {
        WishListService.rename(patrice, "liste-patrice", "patrice");

        assertThat(WishListService.get("liste-patrice")).isNull();
        assertThat(WishListService.get("patrice")).isNotNull();
    }

    @Test()
    public void testRenameExist() throws Exception {
        assertThrows(Exception.class, () -> {
            WishListService.rename(patrice, "liste-patrice", "liste-emmanuel");
        });
    }
}
