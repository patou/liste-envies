package fr.desaintsteban.liste.envies.dto;

import fr.desaintsteban.liste.envies.model.UserShareType;

/**
 *
 */
public class UserShareDto {
    private String email;
    private String name;
    private UserShareType type;

    public UserShareDto() {
    }

    public UserShareDto(String email, String name, UserShareType type) {
        this.email = email;
        this.name = name;
        this.type = type;
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
