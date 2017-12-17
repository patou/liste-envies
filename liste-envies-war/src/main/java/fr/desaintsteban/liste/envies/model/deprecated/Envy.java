package fr.desaintsteban.liste.envies.model.deprecated;

import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.*;
import com.googlecode.objectify.condition.IfNotNull;
import fr.desaintsteban.liste.envies.model.Link;
import fr.desaintsteban.liste.envies.model.Note;
import fr.desaintsteban.liste.envies.util.StringUtils;
import org.codehaus.jackson.annotate.JsonIgnore;

import javax.jdo.annotations.Embedded;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * 01/10/2014.
 * @deprecated
 */
@Cache
@Entity
public class Envy {

    @Parent
    @JsonIgnore
    Key<ListEnvies> list;
    @Id
    private Long id;

    private String owner;
    /**
     * L'envie à été suggéré par une autre personne
     */
    private Boolean suggest = false;
    /**
     * L'envie est archivé
     */
    private Boolean archived = false;
    /**
     * L'envie a été supprimé, mais elle a été noté comme donné.
     */
    private Boolean deleted = false;

    private String label;

    private String description;

    private String price;
    private String picture;
    private Date date;



    private int rating;
    @Embedded
    private List<Link> urls;
    @Index
    private List<String> userTake;
    @Index(IfNotNull.class)
    private List<String> userReceived;

    @Embedded
    private List<Note> notes;


    public Envy() {
        this.notes = new ArrayList<>();
        this.rating = 0;
    }

    public Envy(ListEnvies list, String label) {
        this.list = Key.create(list);
        this.label = label;
        this.notes = new ArrayList<>();
        this.rating = 0;
    }

    public Key<ListEnvies> getList() {
        return list;
    }

    public void setList(Key<ListEnvies> owner) {
        this.list = owner;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getOwner() {
        return owner;
    }

    public void setOwner(String owner) {
        this.owner = owner;
    }

    public Boolean getSuggest() {
        return suggest;
    }

    public Boolean getArchived() {
        return archived;
    }

    public void setArchived(Boolean archived) {
        this.archived = archived;
    }

    public Boolean getDeleted() {
        return deleted;
    }

    public void setDeleted(Boolean deleted) {
        this.deleted = deleted;
    }

    public void setSuggest(Boolean suggest) {
        this.suggest = suggest;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPrice() {
        return price;
    }

    public void setPrice(String price) {
        this.price = price;
    }

    public String getPicture() {
        return picture;
    }

    public void setPicture(String picture) {
        this.picture = picture;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public List<Link> getUrls() {
        return urls;
    }

    public void setUrls(List<Link> urls) {
        this.urls = urls;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

    public void addUrl(String url) {
        if (this.urls == null) {
            this.urls = new ArrayList<>();
        }
        if (!StringUtils.isNullOrEmpty(url)) {
            this.urls.add(new Link(url));
        }
    }

    public void setUserTake(List<String> userTake) {
        this.userTake = userTake;
    }

    public List<String> getUserTake() {
        return userTake;
    }

    public boolean hasUserTaken() {
        return userTake != null && !userTake.isEmpty();
    }

    public void addUserTake(String userTake) {
        if (this.userTake == null) {
            this.userTake = new ArrayList<>();
        }
        if (!StringUtils.isNullOrEmpty(userTake)) {
            this.userTake.add(userTake);
        }
    }

    public void removeUserTake(String userTake) {
        if (userTake != null) {
            this.userTake.remove(userTake);
        }
    }

    public List<String> getUserReceived() {
        return userReceived;
    }

    public void setUserReceived(List<String> userReceived) {
        this.userReceived = userReceived;
    }

    public List<Note> getNotes () {
        return this.notes;
    }

    public void setNotes(List<Note> notes) {
        this.notes = notes;
    }
}
