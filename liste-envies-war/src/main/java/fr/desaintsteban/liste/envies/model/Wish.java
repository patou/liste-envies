package fr.desaintsteban.liste.envies.model;

import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.*;
import com.googlecode.objectify.condition.IfNotNull;
import fr.desaintsteban.liste.envies.dto.WishDto;
import fr.desaintsteban.liste.envies.dto.CommentDto;
import fr.desaintsteban.liste.envies.util.StringUtils;
import org.codehaus.jackson.annotate.JsonIgnore;

import javax.jdo.annotations.Embedded;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 01/10/2014.
 */
@Cache
@Entity
public class Wish {

    @Parent
    @JsonIgnore
    Key<WishList> list;
    @Id
    private Long id;

    private Person owner;
    /**
     * L'envie à été suggéré par une autre personne
     */
    private Boolean suggest = false;
    /**
     * L'envie est archivé
     */
    @Index
    private Boolean archived = false;
    /**
     * L'envie a été supprimé, mais elle a été noté comme donné.
     */
    private Boolean deleted = false;

    private String label;

    private String description;

    private String price;
    private List<String> pictures;
    private Date date;


    private int rating;
    @Embedded
    private List<Link> urls;
    private List<PersonParticipant> userTake;
    @Index(IfNotNull.class)
    private List<String> userReceived;

    @Embedded
    private List<Comment> comments;


    public Wish() {
        this.comments = new ArrayList<>();
        this.rating = 0;
    }

    public Wish(WishList list, String label) {
        this.list = Key.create(list);
        this.label = label;
        this.comments = new ArrayList<>();
        this.rating = 0;
    }


    public Wish(WishDto wish) {
        setId(wish.getId());
        setOwner(Person.fromDto(wish.getOwner(), false));
        setSuggest(wish.getSuggest());
        setDeleted(wish.getDeleted());
        setLabel(wish.getLabel());
        setDescription(wish.getDescription());
        setPrice(wish.getPrice());
        setPictures(wish.getPictures());
        setDate(wish.getDate());
        setUrls(wish.getUrls());
        setRating(wish.getRating());
        if (wish.getUserTake() != null) {
            List<PersonParticipant> userTake = wish.getUserTake().stream().map(PersonParticipant::fromDto).collect(Collectors.toList());
            setUserTake(userTake);
        }
        this.comments = new ArrayList<>();
    }

    public WishDto toDto() {
        return this.toDto(false);
    }

    public WishDto toDtoNoFiltered() {
        return this.toDto(false);
    }
    public WishDto toDto(boolean filter) {
        WishDto wish = new WishDto();
        wish.setId(getId());
        if (getList() != null) {
            wish.setListId(getList().getName());
        }
        wish.setOwner(Person.toDto(getOwner()));
        wish.setSuggest(getSuggest());
        wish.setDeleted(getDeleted());
        wish.setLabel(getLabel());
        wish.setDescription(getDescription());
        wish.setPrice(getPrice());
        wish.setPictures(getPictures());
        wish.setDate(getDate());
        wish.setRating(getRating());
        wish.setUrls(getUrls());

        if (!filter) { // Do not add this, if you doesn't want to have this information. For filter it.
            if (getUserTake() != null) {
                wish.setUserTake(getUserTake().stream().map(PersonParticipant::toDecodeDto).collect(Collectors.toList()));
            }
            else {
                wish.setUserTake(Collections.emptyList());
            }
            if (this.comments != null && !this.comments.isEmpty()) {
                List<CommentDto> listCommentDto = this.comments.stream().map(Comment::toDto).collect(Collectors.toList());
                wish.setComments(listCommentDto);
            }
        }

        return wish;
    }

    public Key<WishList> getList() {
        return list;
    }

    public void setList(Key<WishList> owner) {
        this.list = owner;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Person getOwner() {
        return owner;
    }

    public void setOwner(Person owner) {
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

    public List<String> getPictures() {
        return pictures;
    }

    public void setPictures(List<String> pictures) {
        this.pictures = pictures;
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

    public List<PersonParticipant> getUserTake() {
        return userTake;
    }

    public void setUserTake(List<PersonParticipant> userTake) {
        this.userTake = userTake;
    }

    public boolean hasUserTaken() {
        return userTake != null && !userTake.isEmpty();
    }

    public void addUserTake(PersonParticipant userTake) {
        if (this.userTake == null) {
            this.userTake = new ArrayList<>();
        }
        if (userTake != null) {
            this.userTake.add(userTake);
        }
    }

    public void removeUserTake(String userTake) {
        if (userTake != null) {
            this.userTake.removeIf(user -> user.getEmail().equals(userTake));
        }
    }

    public List<String> getUserReceived() {
        return userReceived;
    }

    public void setUserReceived(List<String> userReceived) {
        this.userReceived = userReceived;
    }

    public void addComment(Comment comment) {
        this.comments.add(comment);
    }

    public List<Comment> getComments() {
        return this.comments;
    }

    public void setComments(List<Comment> comments) {
        this.comments = comments;
    }
}
