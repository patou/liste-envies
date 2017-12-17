package fr.desaintsteban.liste.envies.dto;

import fr.desaintsteban.liste.envies.enums.SharingPrivacyType;
import fr.desaintsteban.liste.envies.enums.WishListType;
import fr.desaintsteban.liste.envies.enums.WishOptionType;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;

import java.util.Date;
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


    // settings
    private String picture; // Picture used for background, or for the list info
    private WishListType type; // Purpose of the event for this list
    private Date date; // date of the event
    private WishOptionType option; // Option for display wish given, or not
    private SharingPrivacyType privacy; // Option for sharing privacy of the all list.


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

    public WishOptionType getOption() {
        return option;
    }

    public void setOption(WishOptionType option) {
        this.option = option;
    }

    public SharingPrivacyType getPrivacy() {
        return privacy;
    }

    public void setPrivacy(SharingPrivacyType privacy) {
        this.privacy = privacy;
    }
}
