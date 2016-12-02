package fr.desaintsteban.liste.envies.dto;

import java.util.List;

/**
 *
 */
public class ListEnviesDto {
    private String name;

    private String title;
    private String description;
    private Boolean isOwner;
    private List<UserShareDto> users;

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
}
