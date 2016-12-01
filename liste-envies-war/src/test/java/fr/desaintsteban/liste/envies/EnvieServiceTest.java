package fr.desaintsteban.liste.envies;

import com.google.appengine.tools.development.testing.LocalDatastoreServiceTestConfig;
import com.google.appengine.tools.development.testing.LocalMemcacheServiceTestConfig;
import com.google.appengine.tools.development.testing.LocalServiceTestHelper;
import com.google.appengine.tools.development.testing.LocalTaskQueueTestConfig;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyFactory;
import com.googlecode.objectify.ObjectifyService;
import com.googlecode.objectify.cache.AsyncCacheFilter;
import fr.desaintsteban.liste.envies.dto.EnvieDto;
import fr.desaintsteban.liste.envies.dto.NoteDto;
import fr.desaintsteban.liste.envies.model.AppUser;
import fr.desaintsteban.liste.envies.model.Envie;
import fr.desaintsteban.liste.envies.service.AppUserService;
import fr.desaintsteban.liste.envies.service.EnviesService;
import fr.desaintsteban.liste.envies.service.OfyService;
import fr.desaintsteban.liste.envies.util.EncodeUtils;
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
        ObjectifyService.factory().register(AppUser.class);
        ObjectifyService.factory().register(Envie.class);
    }

    @Before
    public void setUp() {
        helper.setUp();
        closable = OfyService.begin();
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
        assertThat(envie.getUserTake()).isEqualTo(EncodeUtils.encode("emmanuel@desaintsteban.fr"));
    }

    @Test
    public void testList() throws Exception {
        List<Envie> list = EnviesService.list(patrice, "patrice@desaintsteban.fr");
        assertThat(list).hasSize(2).onProperty("label").contains("Livre", "DVD");
        assertThat(list).hasSize(2).onProperty("userTake").excludes(EncodeUtils.encode("emmanuel@desaintsteban.fr"));
    }

    @Test
    public void testListOther() throws Exception {
        List<Envie> list = EnviesService.list(emmanuel, "patrice@desaintsteban.fr");
        assertThat(list).hasSize(2).onProperty("label").contains("Livre", "DVD");
        assertThat(list).hasSize(2).onProperty("userTake").contains(EncodeUtils.encode("emmanuel@desaintsteban.fr"));
    }

    @Test
    public void testCreate() throws Exception {
        Envie itemDvd = EnviesService.createOrUpdate(emmanuel, "emmanuel@desaintsteban.fr", new Envie(emmanuel, "DVD"));
    }

    @Test
    public void testDelete() throws Exception {
        EnviesService.delete(patrice, "patrice@desaintsteban.fr", livreId);
    }

    @Test
    public void testSaveNote() throws Exception {
        EnvieDto initdto = new EnvieDto();
        initdto.setLabel("Test");
        NoteDto c1 = new NoteDto();
        c1.setOwner("Emmanuel");
        c1.setEmail("emmanuel@desaintsteban.fr");
        c1.setText("Commentaire");
        NoteDto c2 = new NoteDto();
        c2.setEmail("patrice@desaintsteban.fr");
        c2.setOwner("Patrice");
        c2.setText("Commentaire2");
        Envie envie = new Envie(initdto);
        AppUser clemence = AppUserService.createOrUpdate(new AppUser("clemence@desaintsteban.fr", "Clemence"));

        Envie saved = EnviesService.createOrUpdate(emmanuel, "emmanuel@desaintsteban.fr", envie);

        EnviesService.addNote(patrice, saved.getId(), "emmanuel@desaintsteban.fr", c1);
        EnviesService.addNote(clemence, saved.getId(), "emmanuel@desaintsteban.fr", c2);
        Envie get = EnviesService.get(patrice, "emmanuel@desaintsteban.fr", saved.getId());

        EnvieDto dto = get.toDto();

        assertThat(dto.getLabel()).isEqualTo(initdto.getLabel());
        assertThat(dto.getNotes()).onProperty("email").contains("clemence@desaintsteban.fr", "patrice@desaintsteban.fr");
        assertThat(dto.getNotes()).onProperty("text").contains("Commentaire", "Commentaire2");
    }
}
