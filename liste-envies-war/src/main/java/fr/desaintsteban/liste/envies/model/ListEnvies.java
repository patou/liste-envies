package fr.desaintsteban.liste.envies.model;

import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.Cache;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import fr.desaintsteban.liste.envies.dto.UserShareDto;
import fr.desaintsteban.liste.envies.dto.WishListDto;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * @deprecated
 */

@Cache
@Entity()
public class ListEnvies {
    @Id
    private String name;

    private String title;
    private String description;
    private List<UserShare> users;

    // settings



    public ListEnvies() {
    }

    public ListEnvies(String name, String title, String owner, String... shared) {
        this.name = name;
        this.title = title;
        users = new ArrayList<>();
        users.add(new UserShare(owner, UserShareType.OWNER));
        for (String shareUser : shared) {
            users.add(new UserShare(shareUser, UserShareType.SHARED));
        }
    }




    public ListEnvies(WishListDto dto) {
        setName(dto.getName());
        setTitle(dto.getTitle());
        setDescription(dto.getDescription());
        List<UserShare> users = dto.getUsers().stream().map(userShareDto -> new UserShare(userShareDto.getEmail(), userShareDto.getType())).collect(Collectors.toList());
        setUsers(users);


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


    public boolean containsOwner(String email) {
        return (users != null) && users.stream().anyMatch(user -> user.getType() == UserShareType.OWNER && user.getEmail().equals(email));
    }

    public boolean containsUser(String email) {
        return (users != null) && users.stream().anyMatch(user -> user.getEmail().equals(email));
    }

    public Key<ListEnvies> getKey() {
        return Key.create(ListEnvies.class, getName());
    }
}
