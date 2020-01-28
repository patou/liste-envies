package fr.desaintsteban.liste.envies.dto;

import java.util.Date;
import java.util.HashMap;
import java.util.List;

import fr.desaintsteban.liste.envies.enums.WishState;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;

import fr.desaintsteban.liste.envies.enums.SharingPrivacyType;
import fr.desaintsteban.liste.envies.enums.WishListState;
import fr.desaintsteban.liste.envies.enums.WishListType;

/**
 *
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class WishListDto {
    private String name;

    private String title;
    private String description;
    private Boolean isOwner;
    private List<UserShareDto> users;

    private List<UserShareDto> owners;


    // settings
    private String picture; // Picture used for background, or for the list info
    private WishListType type; // Purpose of the event for this list
    private Date date; // date of the event
    private SharingPrivacyType privacy; // Option for sharing privacy of the all list.

    private WishListState state;

    private Boolean canSuggest;

    private HashMap<WishState, Integer> counts;

    public List<UserShareDto> getOwners() {
        return owners;
    }

    public void setOwners(List<UserShareDto> owners) {
        this.owners = owners;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<UserShareDto> getUsers() {
        return users;
    }

    public void setUsers(List<UserShareDto> users) {
        this.users = users;
    }

    public Boolean getOwner() {
        return isOwner;
    }

    public void setOwner(Boolean owner) {
        isOwner = owner;
    }

    public String getPicture() {
        return picture;
    }

    public void setPicture(String picture) {
        this.picture = picture;
    }

    public WishListType getType() {
        return type;
    }

    public void setType(WishListType type) {
        this.type = type;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public SharingPrivacyType getPrivacy() {
        return privacy;
    }

    public void setPrivacy(SharingPrivacyType privacy) {
        this.privacy = privacy;
    }

    public WishListState getState() {
        return state;
    }

    public void setState(WishListState state) {
        this.state = state;
    }

    public Boolean getCanSuggest() {
        return canSuggest;
    }

    public void setCanSuggest(Boolean canSuggest) {
        this.canSuggest = canSuggest;
    }

    public HashMap<WishState, Integer> getCounts() {
        return counts;
    }

    public void setCounts(HashMap<WishState, Integer> counts) {
        this.counts = counts;
    }
}
