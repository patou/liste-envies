package fr.desaintsteban.liste.envies.model;

import com.googlecode.objectify.annotation.Index;

/**
 *
 */
public class UserShare {
    @Index
    private String email;
    private String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    private UserShareType type;

    public UserShare() {
    }

    public UserShare(String email, UserShareType type) {
        this.email = email;
        this.name = email;
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
}