package fr.desaintsteban.liste.envies.model;

import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.Cache;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import fr.desaintsteban.liste.envies.dto.ListEnviesDto;
import fr.desaintsteban.liste.envies.dto.UserShareDto;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 *
 */
@Cache
@Entity()
public class ListEnvies {
    @Id
    private String name;

    private String title;
    private String description;
    private List<UserShare> users;

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

    public ListEnvies(ListEnviesDto dto) {
        setName(dto.getName());
        setTitle(dto.getTitle());
        setDescription(dto.getDescription());
        List<UserShare> users = new ArrayList<>();
        for (UserShareDto userShareDto : dto.getUsers()) {
            users.add(new UserShare(userShareDto.getEmail(), userShareDto.getType()));
        }
        setUsers(users);
    }

    public ListEnviesDto toDto(boolean convertUsers, String userEmail, Map<String, AppUser> userName) {
        ListEnviesDto dto = new ListEnviesDto();
        dto.setName(getName());
        dto.setTitle(getTitle());
        dto.setDescription(getDescription());
        List<UserShare> users = getUsers();
        List<UserShareDto> usersDto = new ArrayList<>();
        List<UserShareDto> ownersDto = new ArrayList<>();
        for (UserShare user : users) {
            UserShareDto userShareDto = new UserShareDto(user.getEmail(), user.getType(), userName);
            if (user.getType() == UserShareType.OWNER) {
                ownersDto.add(userShareDto);
            }
            if (convertUsers) {
                usersDto.add(userShareDto);
            }
        }
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
        if (users != null) {
            for (UserShare user : users) {
                if (user.getType() == UserShareType.OWNER && user.getEmail().equals(email))
                    return true;
            }
        }
        return false;
    }

    public boolean containsUser(String email) {
        if (users != null) {
            for (UserShare user : users) {
                if (user.getEmail().equals(email))
                    return true;
            }
        }
        return false;
    }

    public Key<ListEnvies> getKey() {
        return Key.create(ListEnvies.class, getName());
    }
}
