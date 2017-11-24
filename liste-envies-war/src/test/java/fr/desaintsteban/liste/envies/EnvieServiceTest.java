package fr.desaintsteban.liste.envies;

import com.google.appengine.tools.development.testing.LocalDatastoreServiceTestConfig;
import com.google.appengine.tools.development.testing.LocalMemcacheServiceTestConfig;
import com.google.appengine.tools.development.testing.LocalServiceTestHelper;
import com.google.appengine.tools.development.testing.LocalTaskQueueTestConfig;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyFactory;
import com.googlecode.objectify.ObjectifyService;
import com.googlecode.objectify.cache.AsyncCacheFilter;
import fr.desaintsteban.liste.envies.dto.EnvyDto;
import fr.desaintsteban.liste.envies.dto.NoteDto;
import fr.desaintsteban.liste.envies.model.AppUser;
import fr.desaintsteban.liste.envies.model.Envy;
import fr.desaintsteban.liste.envies.model.ListEnvies;
import fr.desaintsteban.liste.envies.model.Notification;
import fr.desaintsteban.liste.envies.service.AppUserService;
import fr.desaintsteban.liste.envies.service.EnviesService;
import fr.desaintsteban.liste.envies.service.ListEnviesService;
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
    private ListEnvies listePatrice;
    private ListEnvies listeEmmanuel;
    private AppUser clemence;

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
        ObjectifyService.factory().register(Envy.class);
        ObjectifyService.factory().register(ListEnvies.class);
        ObjectifyService.factory().register(Notification.class);
    }

    @Before
    public void setUp() {
        helper.setUp();
        closable = OfyService.begin();
        patrice = new AppUser("patrice@desaintsteban.fr", "Patrice");
        AppUserService.createOrUpdate(patrice);
        emmanuel = new AppUser("emmanuel@desaintsteban.fr", "Emmanuel");
        AppUserService.createOrUpdate(emmanuel);
        clemence = AppUserService.createOrUpdate(new AppUser("clemence@desaintsteban.fr", "Clemence"));
        listePatrice = ListEnviesService.createOrUpdate(patrice, new ListEnvies("liste-patrice", "Liste de Patrice", patrice.getEmail(), emmanuel.getEmail()));
        listeEmmanuel = ListEnviesService.createOrUpdate(emmanuel, new ListEnvies("liste-emmanuel", "Liste d'Emmanuel", emmanuel.getEmail(), patrice.getEmail(), clemence.getEmail()));

        EnvyDto itemLivre = EnviesService.createOrUpdate(patrice, "liste-patrice", new Envy(listePatrice, "Livre"));
        livreId = itemLivre.getId();
        EnvyDto itemDvd = EnviesService.createOrUpdate(patrice, "liste-patrice", new Envy(listePatrice, "DVD"));
        dvdId = itemDvd.getId();
        EnviesService.given(emmanuel, "liste-patrice", livreId);
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
        Envy envie = EnviesService.get(patrice, "liste-patrice", livreId);
        assertThat(envie.getLabel()).isEqualTo("Livre");
        assertThat(envie.getUserTake()).isNull();
    }

    @Test
    public void testGetNotSameUser() throws Exception {
        Envy envie = EnviesService.get(emmanuel, "liste-patrice", livreId);
        assertThat(envie.getLabel()).isEqualTo("Livre");
        assertThat(envie.getUserTake()).contains(EncodeUtils.encode("emmanuel@desaintsteban.fr"));
    }

    @Test
    public void testList() throws Exception {
        List<Envy> list = EnviesService.list(patrice, "liste-patrice");
        assertThat(list).hasSize(2).onProperty("label").contains("Livre", "DVD");
        assertThat(list).hasSize(2).onProperty("userTake").excludes(EncodeUtils.encode("emmanuel@desaintsteban.fr"));
    }

    @Test
    public void testListOther() throws Exception {
        List<Envy> list = EnviesService.list(emmanuel, "liste-patrice");
        assertThat(list).hasSize(2).onProperty("label").contains("Livre", "DVD");
        //assertThat(list).hasSize(2).onProperty("userTake"). contains(EncodeUtils.encode("emmanuel@desaintsteban.fr"));
    }

    @Test
    public void testCreate() throws Exception {
        EnvyDto itemDvd = EnviesService.createOrUpdate(emmanuel, "liste-emmanuel", new Envy(listeEmmanuel, "DVD"));
    }

    @Test
    public void testDelete() throws Exception {
        EnviesService.delete(patrice, "liste-patrice", livreId);
    }

    @Test
    public void testSaveNote() throws Exception {
        EnvyDto initdto = new EnvyDto();
        initdto.setLabel("Test");
        NoteDto c1 = new NoteDto();
        c1.setOwner("Emmanuel");
        c1.setEmail("emmanuel@desaintsteban.fr");
        c1.setText("Commentaire");
        NoteDto c2 = new NoteDto();
        c2.setEmail("clemence@desaintsteban.fr");
        c2.setOwner("Patrice");
        c2.setText("Commentaire2");
        Envy envie = new Envy(initdto);

        EnvyDto saved = EnviesService.createOrUpdate(emmanuel, "liste-emmanuel", envie);

        EnviesService.addNote(patrice, saved.getId(), "liste-emmanuel", c1);
        EnviesService.addNote(clemence, saved.getId(), "liste-emmanuel", c2);
        Envy get = EnviesService.get(patrice, "liste-emmanuel", saved.getId());

        EnvyDto dto = get.toDto();

        assertThat(dto.getLabel()).isEqualTo(initdto.getLabel());
        assertThat(dto.getNotes()).onProperty("email").contains("clemence@desaintsteban.fr", "patrice@desaintsteban.fr");
        assertThat(dto.getNotes()).onProperty("text").contains("Commentaire", "Commentaire2");
    }
}
