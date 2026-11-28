package fr.desaintsteban.liste.envies;

import com.google.cloud.datastore.Datastore;
import com.google.cloud.datastore.DatastoreOptions;
import com.google.cloud.datastore.Entity;
import com.google.cloud.datastore.Key;
import com.googlecode.objectify.ObjectifyService;
import fr.desaintsteban.liste.envies.model.WishList;
import fr.desaintsteban.liste.envies.service.OfyService;
import fr.desaintsteban.liste.envies.service.WishListService;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Regression: a legacy WishList entity stored with a "name" property in addition to its key name
 * (seen in production logs for test_4_2026) must still load, and keep its identity on save.
 */
public class WishListLegacyNamePropertyTest extends BaseDatastoreTest {

    private Datastore rawDatastore() {
        String host = System.getProperty("DATASTORE_EMULATOR_HOST");
        return DatastoreOptions.newBuilder().setProjectId("test-project").setHost(host).build().getService();
    }

    private void putLegacy(String keyName) {
        Datastore ds = rawDatastore();
        Key key = ds.newKeyFactory().setKind("WishList").newKey(keyName);
        com.google.cloud.datastore.FullEntity<?> owner = com.google.cloud.datastore.FullEntity.newBuilder()
                .set("email", "emmanuel@desaintsteban.fr").set("name", "Emmanuel").set("type", "OWNER").build();
        ds.put(Entity.newBuilder(key)
                .set("name", keyName)
                .set("title", "test 4 2026")
                .set("status", "ACTIVE")
                .set("privacy", "PRIVATE")
                .set("type", "LEAVING")
                .set("users", com.google.cloud.datastore.ListValue.of(com.google.cloud.datastore.EntityValue.of(owner)))
                .build());
    }

    @Test
    public void legacyNamePropertyDoesNotBreakList() {
        putLegacy("test_4_2026");
        List<WishList> lists = WishListService.list("emmanuel@desaintsteban.fr");
        assertThat(lists).hasSize(1);
        assertThat(lists.get(0).getName()).isEqualTo("test_4_2026");
        assertThat(lists.get(0).getTitle()).isEqualTo("test 4 2026");
    }

    @Test
    public void legacyNamePropertyDoesNotBreakGetByKey() {
        putLegacy("test_4_2026");
        WishList l = WishListService.get("test_4_2026");
        assertThat(l).isNotNull();
        assertThat(l.getName()).isEqualTo("test_4_2026");
    }

    @Test
    public void saveKeepsKeyNameAndCleanEntitiesStillWork() {
        putLegacy("test_4_2026");
        WishList l = WishListService.get("test_4_2026");
        OfyService.ofy().save().entity(l).now();
        WishList again = WishListService.get("test_4_2026");
        assertThat(again.getName()).isEqualTo("test_4_2026");
        assertThat(rawDatastore().get(rawDatastore().newKeyFactory().setKind("WishList").newKey("test_4_2026"))).isNotNull();
        WishList fresh = new WishList("new_list", "New", "a@b.fr");
        OfyService.ofy().save().entity(fresh).now();
        assertThat(WishListService.get("new_list").getName()).isEqualTo("new_list");
    }
}
