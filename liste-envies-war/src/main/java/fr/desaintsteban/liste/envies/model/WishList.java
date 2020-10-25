package fr.desaintsteban.liste.envies.model;

import com.google.common.annotations.VisibleForTesting;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.Cache;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;
import fr.desaintsteban.liste.envies.dto.WishListDto;
import fr.desaintsteban.liste.envies.enums.SharingPrivacyType;
import fr.desaintsteban.liste.envies.enums.UserShareType;
import fr.desaintsteban.liste.envies.enums.WishListStatus;
import fr.desaintsteban.liste.envies.enums.WishListType;
import fr.desaintsteban.liste.envies.enums.WishState;

import javax.jdo.annotations.Embedded;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

/**
 *
 */
@Cache
@Entity()
public class WishList {
    @Id
    private String name;

    private String title;
    private String description;
    private List<UserShare> users;

    // settings
    private String picture; // Picture used for background, or for the list info
    private WishListType type; // Purpose of the event for this list
    private Date date; // date of the event
    private SharingPrivacyType privacy; // Option for sharing privacy of the all list.
    @Embedded
    @Index
    private HashMap<WishState, Integer> counts = new HashMap<>(); //Compte le nombre d'envies dans chaque état

    @Index
    private WishListStatus status =  WishListStatus.ACTIVE; // status

    public WishList() {
        this.privacy = SharingPrivacyType.PRIVATE;
    }

    @VisibleForTesting
    public WishList(String name, String title, String owner, String... shared) {
        this.name = name;
        this.title = title;
        users = new ArrayList<>();
        users.add(new UserShare(owner, UserShareType.OWNER));
        for (String shareUser : shared) {
            users.add(new UserShare(shareUser, UserShareType.SHARED));
        }

        this.picture = "img/default.jpg";
        this.type = WishListType.OTHER;
        this.date = new Date(2020 - 1900, Calendar.DECEMBER, 25);
        this.privacy = SharingPrivacyType.PRIVATE;
    }

    public WishList(String name, String title, String description, String picture, WishListType type,
                    Date date, SharingPrivacyType privacy, String owner, String... shared) {
        this.name = name;
        this.title = title;
        this.description = description;
        this.picture = picture;
        this.type = type;
        this.date = date;
        this.privacy = privacy;

        users = new ArrayList<>();
        users.add(new UserShare(owner, UserShareType.OWNER));
        for (String shareUser : shared) {
            users.add(new UserShare(shareUser, UserShareType.SHARED));
        }
    }


    public WishList(WishListDto dto) {
        setName(dto.getName());
        setTitle(dto.getTitle());
        setDescription(dto.getDescription());
        List<UserShare> users = dto.getUsers().stream().map(userShareDto -> new UserShare(userShareDto.getEmail(), userShareDto.getType())).collect(Collectors.toList());
        setUsers(users);
        setPicture( dto.getPicture());
        setType( dto.getType());
        setDate( dto.getDate());
        setPrivacy( dto.getPrivacy());
        setStatus(dto.getStatus());
    }

    public WishListDto toDto() {
        WishListDto dto = new WishListDto();
        dto.setName(getName());
        dto.setTitle(getTitle());
        dto.setDescription(getDescription());
        dto.setPicture( getPicture());
        dto.setType( getType());
        dto.setDate( getDate());
        dto.setPrivacy( getPrivacy());
        dto.setOwner(false);
        dto.setCounts(getCounts());
        dto.setStatus(getStatus());
        return dto;
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

    public List<UserShare> getUsers() {
        return users;
    }

    public void setUsers(List<UserShare> users) {
        this.users = users;
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

    public boolean containsOwner(String email) {
        return (users != null) && users.stream().anyMatch(user -> user.getType() == UserShareType.OWNER && user.getEmail().equals(email));
    }

    public boolean containsUser(String email) {
        return (users != null) && users.stream().anyMatch(user -> user.getEmail().equals(email));
    }

    public Key<WishList> getKey() {
        return Key.create(WishList.class, getName());
    }

    public void addUser(AppUser user) {
        if (users == null) users = new ArrayList<>();
        users.add(new UserShare(user.getEmail(), UserShareType.SHARED));
    }

    public HashMap<WishState, Integer> getCounts() {
        return counts;
    }

    public Integer getCounts(WishState state) {
        return counts.getOrDefault(state, 0);
    }

    public void resetCounts() {
        counts = new HashMap<>();
    }

    public void incrCounts(WishState state) {
        counts.compute(state, (k, v) -> v != null ? v + 1 : 1);
    }

    public void decrCounts(WishState state) {
        counts.computeIfPresent(state, (k, v) -> v - 1);
    }

    public void changeCountsCount(WishState from, WishState to) {
        decrCounts(from);
        incrCounts(to);
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
