package fr.desaintsteban.liste.envies.model;

import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.AlsoLoad;
import com.googlecode.objectify.annotation.Cache;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;
import com.googlecode.objectify.annotation.Parent;
import com.googlecode.objectify.condition.IfNotNull;
import fr.desaintsteban.liste.envies.dto.CommentDto;
import fr.desaintsteban.liste.envies.dto.WishDto;
import fr.desaintsteban.liste.envies.enums.WishState;
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

    @Index
    private WishState state = WishState.ACTIVE;

    private Date stateDate;

    /**
     * L'envie a été noté comme donné.
     */
    private boolean allreadyGiven = false;

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
        setState(wish.getState());
        setLabel(wish.getLabel());
        setDescription(wish.getDescription());
        setPrice(wish.getPrice());
        setPictures(wish.getPictures());
        setDate(wish.getDate());
        setUrls(cleanUrl(wish.getUrls()));
        setRating(wish.getRating());
        setAllreadyGiven(wish.getAllreadyGiven());
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
        wish.setState(getState());
        wish.setLabel(getLabel());
        wish.setDescription(getDescription());
        wish.setPrice(getPrice());
        wish.setPictures(getPictures());
        wish.setDate(getDate());
        wish.setRating(getRating());
        wish.setUrls(cleanUrl(getUrls()));
        wish.setAllreadyGiven(getAllreadyGiven());

        if (!filter) { // Do not add this, if you doesn't want to have this information. For filter it.
            if (getUserTake() != null) {
                wish.setUserTake(getUserTake().stream().map(PersonParticipant::toDecodeDto).collect(Collectors.toList()));
                wish.setGiven(true);
            }
            else {
                wish.setUserTake(Collections.emptyList());
                wish.setGiven(false);
            }
            if (this.comments != null && !this.comments.isEmpty()) {
                List<CommentDto> listCommentDto = this.comments.stream().map(Comment::toDto).collect(Collectors.toList());
                wish.setComments(listCommentDto);
            }
        }

        return wish;
    }

    /**
     * Clean all links with url null
     * @param links
     * @return
     */
    private List<Link> cleanUrl(List<Link> links) {
        if (links == null || links.isEmpty())
            return links;
        return links.stream().filter(link -> link.getUrl() != null).collect(Collectors.toList());
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
        return state == WishState.ARCHIVED;
    }

    @Deprecated
    public void setArchived(Boolean archived) {
        if (archived)
            setState(WishState.ARCHIVED);
    }

    public Boolean getDeleted() {
        return state == WishState.DELETED;
    }

    @Deprecated
    public void setDeleted(Boolean deleted) {
        if (deleted)
            setState(WishState.DELETED);
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

    public boolean getAllreadyGiven() {
        return allreadyGiven;
    }

    public void setAllreadyGiven(boolean allreadyGiven) {
        this.allreadyGiven = allreadyGiven;
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

    public WishState getState() {
        return state;
    }

    public Date getStateDate() {
        return stateDate;
    }

    public void setStateDate(Date stateDate) {
        this.stateDate = stateDate;
    }

    public void setState(WishState state) {
        this.state = state;
    }

    void convertArchivedToState(@AlsoLoad("archived") Boolean archived) {
        if (archived) state = WishState.ARCHIVED;
    }

    void convertDeletedToState(@AlsoLoad("deleted") Boolean deleted) {
        if (deleted) state = WishState.DELETED;
    }
}
