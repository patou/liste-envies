package fr.desaintsteban.liste.envies.dto;

import fr.desaintsteban.liste.envies.model.AppUser;
import fr.desaintsteban.liste.envies.model.UserShareType;

import java.util.Map;

/**
 *
 */
public class UserShareDto {
    private String email;
    private String name;
    private UserShareType type;

    public UserShareDto() {
    }

    public UserShareDto(String email, UserShareType type) {
        this.email = email;
        this.type = type;
    }

    public UserShareDto(String email, UserShareType type, Map<String, AppUser> userName) {
        this.email = email;
        this.type = type;
        if (userName != null && userName.containsKey(email)) {
            this.name = userName.get(email).getName();
        }
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public UserShareType getType() {
        return type;
    }

    public void setType(UserShareType type) {
        this.type = type;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
