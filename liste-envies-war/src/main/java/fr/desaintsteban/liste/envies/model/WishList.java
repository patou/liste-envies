package fr.desaintsteban.liste.envies.model;

import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.Cache;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import fr.desaintsteban.liste.envies.dto.WishListDto;
import fr.desaintsteban.liste.envies.dto.UserShareDto;
import fr.desaintsteban.liste.envies.enums.SharingPrivacyType;
import fr.desaintsteban.liste.envies.enums.UserShareType;
import fr.desaintsteban.liste.envies.enums.WishListType;
import fr.desaintsteban.liste.envies.enums.WishOptionType;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
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
    private WishOptionType option; // Option for display wish given, or not
    private SharingPrivacyType privacy; // Option for sharing privacy of the all list.


    public WishList() {
        this.picture = "img/christmas1.jpg";
        this.type = type;
        this.date = new Date(2017, 12, 25);
        this.option = WishOptionType.HIDDEN;
        this.privacy = SharingPrivacyType.PRIVATE;
    }

    public WishList(String name, String title, String owner, String... shared) {
        this.name = name;
        this.title = title;
        users = new ArrayList<>();
        users.add(new UserShare(owner, UserShareType.OWNER));
        for (String shareUser : shared) {
            users.add(new UserShare(shareUser, UserShareType.SHARED));
        }

        this.picture = "img/christmas1.jpg";
        this.type = type;
        this.date = new Date(2017, 12, 25);
        this.option = WishOptionType.HIDDEN;
        this.privacy = SharingPrivacyType.PRIVATE;
    }

    public WishList(String name, String title, String description, String picture, WishListType type,
                    Date date, WishOptionType option, SharingPrivacyType privacy, String owner, String... shared) {
        this.name = name;
        this.title = title;
        this.description = description;
        this.users = users;
        this.picture = picture;
        this.type = type;
        this.date = date;
        this.option = option;
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
        setOption( dto.getOption());
        setPrivacy( dto.getPrivacy());
    }

    public WishListDto toDto(boolean convertUsers, String userEmail, Map<String, AppUser> userName) {
        WishListDto dto = new WishListDto();
        dto.setName(getName());
        dto.setTitle(getTitle());
        dto.setDescription(getDescription());
        List<UserShare> users = getUsers();
        List<UserShareDto> usersDto = new ArrayList<>();
        List<UserShareDto> ownersDto = new ArrayList<>();
        users.forEach(user -> {
            UserShareDto userShareDto = new UserShareDto(user.getEmail(), user.getType(), userName);
            if (user.getType() == UserShareType.OWNER) {
                ownersDto.add(userShareDto);
            }
            if (convertUsers) {
                usersDto.add(userShareDto);
            }
        });
        if (convertUsers) {
            dto.setUsers(usersDto);
        }
        dto.setOwners(ownersDto);
        if (userEmail != null) {
            dto.setOwner(containsOwner(userEmail));
        }

        dto.setPicture( getPicture());
        dto.setType( getType());
        dto.setDate( getDate());
        dto.setOption( getOption());
        dto.setPrivacy( getPrivacy());

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

    public boolean containsOwner(String email) {
        return (users != null) && users.stream().anyMatch(user -> user.getType() == UserShareType.OWNER && user.getEmail().equals(email));
    }

    public boolean containsUser(String email) {
        return (users != null) && users.stream().anyMatch(user -> user.getEmail().equals(email));
    }

    public Key<WishList> getKey() {
        return Key.create(WishList.class, getName());
    }
}
