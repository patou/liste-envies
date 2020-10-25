package fr.desaintsteban.liste.envies;

import com.google.appengine.tools.development.testing.LocalDatastoreServiceTestConfig;
import com.google.appengine.tools.development.testing.LocalMemcacheServiceTestConfig;
import com.google.appengine.tools.development.testing.LocalServiceTestHelper;
import com.google.appengine.tools.development.testing.LocalTaskQueueTestConfig;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyFactory;
import com.googlecode.objectify.ObjectifyService;
import com.googlecode.objectify.cache.AsyncCacheFilter;
import fr.desaintsteban.liste.envies.dto.PersonDto;
import fr.desaintsteban.liste.envies.dto.WishDto;
import fr.desaintsteban.liste.envies.dto.CommentDto;
import fr.desaintsteban.liste.envies.enums.WishState;
import fr.desaintsteban.liste.envies.model.AppUser;
import fr.desaintsteban.liste.envies.model.Wish;
import fr.desaintsteban.liste.envies.model.WishList;
import fr.desaintsteban.liste.envies.model.Notification;
import fr.desaintsteban.liste.envies.service.AppUserService;
import fr.desaintsteban.liste.envies.service.WishesService;
import fr.desaintsteban.liste.envies.service.WishListService;
import fr.desaintsteban.liste.envies.service.OfyService;
import org.junit.After;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;

import java.io.Closeable;
import java.io.IOException;
import java.util.Date;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.extractProperty;

@SuppressWarnings("ConstantConditions")
public class WishServiceTest {
    private final LocalServiceTestHelper helper = new LocalServiceTestHelper(
            new LocalDatastoreServiceTestConfig().setApplyAllHighRepJobPolicy(),
            new LocalMemcacheServiceTestConfig(),
            new LocalTaskQueueTestConfig());
    private Closeable closable;
    private AppUser patrice;
    private Long livreId;
    private Long dvdId;
    private AppUser emmanuel;
    private WishList listePatrice;
    private WishList listeEmmanuel;
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
        ObjectifyService.factory().register(Wish.class);
        ObjectifyService.factory().register(WishList.class);
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
        listePatrice = WishListService.createOrUpdate(patrice, new WishList("liste-patrice", "Liste de Patrice", patrice.getEmail(), emmanuel.getEmail()));
        listeEmmanuel = WishListService.createOrUpdate(emmanuel, new WishList("liste-emmanuel", "Liste d'Emmanuel", emmanuel.getEmail(), patrice.getEmail(), clemence.getEmail()));

        WishDto itemLivre = WishesService.createOrUpdate(patrice, "liste-patrice", new Wish(listePatrice, "Livre"));
        livreId = itemLivre.getId();
        WishDto itemDvd = WishesService.createOrUpdate(patrice, "liste-patrice", new Wish(listePatrice, "DVD"));
        dvdId = itemDvd.getId();
        WishesService.give(emmanuel, "liste-patrice", livreId);
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
        WishDto envie = WishesService.get(patrice, "liste-patrice", livreId);
        assertThat(envie.getLabel()).isEqualTo("Livre");
        assertThat(envie.getUserTake()).isNull();
    }

    @Test
    public void testGetNotSameUser() throws Exception {
        WishDto envie = WishesService.get(emmanuel, "liste-patrice", livreId);
        assertThat(envie.getLabel()).isEqualTo("Livre");
        assertThat(extractProperty("email").from(envie.getUserTake())).contains("emmanuel@desaintsteban.fr");
    }

    @Test
    public void testList() throws Exception {
        List<WishDto> list = WishesService.list(patrice, "liste-patrice", false);
        assertThat(extractProperty("label").from(list)).hasSize(2).contains("Livre", "DVD");
        assertThat(extractProperty("userTake").from(list)).hasSize(2).doesNotContain("emmanuel@desaintsteban.fr");
    }


    @Test
    public void testListWithArchived() throws Exception {
        WishesService.archive(patrice, "liste-patrice", livreId);
        List<WishDto> list = WishesService.list(patrice, "liste-patrice", false);
        assertThat(extractProperty("label").from(list)).hasSize(1).contains("DVD");
    }


    @Test
    public void testListGived() throws Exception {
        List<WishDto> list = WishesService.given(emmanuel);
        assertThat(extractProperty("label").from(list)).hasSize(1).contains("Livre");
    }


    @Test
    public void testListArchived() throws Exception {
        WishesService.archive(patrice, "liste-patrice", livreId);
        List<WishDto> list = WishesService.archived(patrice);
        assertThat(extractProperty("label").from(list)).hasSize(1).contains("Livre");
        assertThat(WishesService.given(emmanuel)).isEmpty();
    }

    @Test
    public void testListOther() throws Exception {
        List<WishDto> list = WishesService.list(emmanuel, "liste-patrice", false);
        assertThat(extractProperty("label").from(list)).hasSize(2).contains("Livre", "DVD");
        //assertThat(list).hasSize(2).onProperty("userTake"). contains(EncodeUtils.encode("emmanuel@desaintsteban.fr"));
    }

    @Test
    public void testCreate() throws Exception {
        WishDto itemDvd = WishesService.createOrUpdate(emmanuel, "liste-emmanuel", new Wish(listeEmmanuel, "DVD"));
    }

    @Test
    public void testDelete() throws Exception {
        WishesService.delete(patrice, "liste-patrice", livreId);
    }

    @Test
    public void testSaveComment() throws Exception {
        WishDto initdto = new WishDto();
        initdto.setLabel("Test");
        CommentDto c1 = new CommentDto();
        c1.setFrom(new PersonDto("emmanuel@desaintsteban.fr","Emmanuel"));
        c1.setText("Commentaire");
        CommentDto c2 = new CommentDto();
        c2.setFrom(new PersonDto("clemence@desaintsteban.fr","Clémence"));
        c2.setText("Commentaire2");
        Wish envie = new Wish(initdto);

        WishDto saved = WishesService.createOrUpdate(emmanuel, "liste-emmanuel", envie);

        WishesService.addComment(patrice, saved.getId(), "liste-emmanuel", c1);
        WishesService.addComment(clemence, saved.getId(), "liste-emmanuel", c2);
        WishDto dto = WishesService.get(patrice, "liste-emmanuel", saved.getId());

        assertThat(dto.getLabel()).isEqualTo(initdto.getLabel());
        assertThat(extractProperty("from.email").from(dto.getComments())).contains("patrice@desaintsteban.fr", "clemence@desaintsteban.fr");
        assertThat(extractProperty("text").from(dto.getComments())).contains("Commentaire", "Commentaire2");
    }

    @Test
    public void renameWishList() throws Exception {
        WishListService.rename(patrice, "liste-patrice", "patrice");

        assertThat(extractProperty("id").from(WishesService.list(patrice, "patrice"))).contains(livreId, dvdId);
        assertThat(WishesService.list(patrice, "liste-patrice")).isEmpty();
    }

    @Test
    public void testStateArchived() throws Exception {
        WishesService.archive(patrice, "liste-patrice", livreId);
        Wish envie = OfyService.ofy().load().key(Key.create(Key.create(WishList.class, "liste-patrice"), Wish.class, livreId)).now();

        assertThat(envie.getState()).isEqualTo(WishState.ARCHIVED);
        assertThat(envie.getStateDate()).isEqualToIgnoringMinutes(new Date());
    }

    @Test
    public void testCountsWishList() throws Exception {
        assertThat(listePatrice.getCounts(WishState.ACTIVE)).isEqualTo(2);
        assertThat(listePatrice.getCounts(WishState.ARCHIVED)).isEqualTo(0);
        assertThat(listePatrice.getCounts(WishState.DELETED)).isEqualTo(0);

        WishesService.archive(patrice, "liste-patrice", livreId);
        assertThat(listePatrice.getCounts(WishState.ACTIVE)).isEqualTo(1);
        assertThat(listePatrice.getCounts(WishState.ARCHIVED)).isEqualTo(1);
        assertThat(listePatrice.getCounts(WishState.DELETED)).isEqualTo(0);

        WishesService.delete(patrice, "liste-patrice", livreId);
        assertThat(listePatrice.getCounts(WishState.ACTIVE)).isEqualTo(1);
        assertThat(listePatrice.getCounts(WishState.ARCHIVED)).isEqualTo(0);
        assertThat(listePatrice.getCounts(WishState.DELETED)).isEqualTo(1);
    }
}
