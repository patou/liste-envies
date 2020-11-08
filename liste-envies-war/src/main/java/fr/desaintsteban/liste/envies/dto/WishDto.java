package fr.desaintsteban.liste.envies.dto;

import fr.desaintsteban.liste.envies.enums.WishState;
import fr.desaintsteban.liste.envies.model.Link;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;

import java.util.Date;
import java.util.List;

/**
 * 01/10/2014.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class WishDto {
    private Long id;
    private String listId;
    private String listTitle;

    private PersonDto owner;
    private Boolean suggest = false;
    private WishState state = WishState.ACTIVE;
    private String label;

    private String description;

    private String price;
    private List<String> pictures;
    private Date date;
    private List<Link> urls;
    private List<PersonParticipantDto> userTake;
    private Boolean given;
    private Boolean userGiven;
    private boolean allreadyGiven;
    private Boolean canEdit;
    private Boolean canParticipate;
    private Boolean canSuggest;

    private List<CommentDto> comments;


    private int rating;

    public WishDto() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getListId() {
        return listId;
    }

    public void setListId(String listId) {
        this.listId = listId;
    }

    public String getListTitle() {
        return listTitle;
    }

    public void setListTitle(String listTitle) {
        this.listTitle = listTitle;
    }
    public PersonDto getOwner() {
        return owner;
    }

    public void setOwner(PersonDto owner) {
        this.owner = owner;
    }

    public Boolean getSuggest() {
        return suggest;
    }

    public void setSuggest(Boolean suggest) {
        this.suggest = suggest;
    }

    public Boolean getDeleted() {
        return state == WishState.DELETED;
    }

    @Deprecated
    public void setDeleted(Boolean deleted) {

    }

    public Boolean getArchived() {
        return state == WishState.ARCHIVED;
    }

    @Deprecated
    public void setArchived(Boolean archived) {

    }

    public WishState getState() {
        return state;
    }

    public void setState(WishState state) {
        this.state = state;
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

    public List<PersonParticipantDto> getUserTake() {
        return userTake;
    }

    public void setUserTake(List<PersonParticipantDto> userTake) {
        this.userTake = userTake;
    }

    public String getPrice() {
        return price;
    }

    public void setPrice(String price) {
        this.price = price;
    }

    public List<CommentDto> getComments() {
        return comments;
    }

    public void setComments(List<CommentDto> comments) {
        this.comments = comments;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

    public Boolean getGiven() {
        return given;
    }

    public void setGiven(Boolean given) {
        this.given = given;
    }

    public boolean getAllreadyGiven() {
        return allreadyGiven;
    }

    public void setAllreadyGiven(boolean allreadyGiven) {
        this.allreadyGiven = allreadyGiven;
    }

    public Boolean getCanEdit() {
        return canEdit;
    }

    public void setCanEdit(Boolean canEdit) {
        this.canEdit = canEdit;
    }

    public Boolean getUserGiven() {
        return userGiven;
    }

    public void setUserGiven(Boolean userGiven) {
        this.userGiven = userGiven;
    }

    public Boolean getCanParticipate() {
        return canParticipate;
    }

    public void setCanParticipate(Boolean canParticipate) {
        this.canParticipate = canParticipate;
    }

    public Boolean getCanSuggest() {
        return canSuggest;
    }

    public void setCanSuggest(Boolean canSuggest) {
        this.canSuggest = canSuggest;
    }
}
