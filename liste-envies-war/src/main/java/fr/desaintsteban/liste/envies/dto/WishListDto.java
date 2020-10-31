package fr.desaintsteban.liste.envies.dto;

import fr.desaintsteban.liste.envies.enums.SharingPrivacyType;
import fr.desaintsteban.liste.envies.enums.WishListState;
import fr.desaintsteban.liste.envies.enums.WishListStatus;
import fr.desaintsteban.liste.envies.enums.WishListType;
import fr.desaintsteban.liste.envies.enums.WishState;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;

import java.util.Date;
import java.util.HashMap;
import java.util.List;

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
    private WishListStatus status; // status

    // settings
    private String picture; // Picture used for background, or for the list info
    private WishListType type; // Purpose of the event for this list
    private Date date; // date of the event
    private SharingPrivacyType privacy; // Option for sharing privacy of the all list.
    private Boolean forceAnonymous;
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

    public Boolean getForceAnonymous() {
        return forceAnonymous;
    }

    public void setForceAnonymous(Boolean forceAnonymous) {
        this.forceAnonymous = forceAnonymous;
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

    public WishListStatus getStatus() {
        return status;
    }

    public void setStatus(WishListStatus status) {
        this.status = status;
    }
}
