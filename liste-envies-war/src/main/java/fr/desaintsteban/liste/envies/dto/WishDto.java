package fr.desaintsteban.liste.envies.dto;

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
    private Boolean deleted = false;
    private Boolean archived = false;
    private String label;

    private String description;

    private String price;
    private List<String> pictures;
    private Date date;
    private List<Link> urls;
    private List<PersonParticipantDto> userTake;

    private List<NoteDto> notes;


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
        return deleted;
    }

    public void setDeleted(Boolean deleted) {
        this.deleted = deleted;
    }

    public Boolean getArchived() {
        return archived;
    }

    public void setArchived(Boolean archived) {
        this.archived = archived;
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

    public List<NoteDto> getNotes() {
        return notes;
    }

    public void setNotes(List<NoteDto> notes) {
        this.notes = notes;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }
}
