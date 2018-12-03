package fr.desaintsteban.liste.envies.dto;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;

import java.util.Date;

/**
 *
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class AppUserDto {
    private String email;

    private String name;

    public String getPicture() {
        return picture;
    }

    public void setPicture(String picture) {
        this.picture = picture;
    }

    private String picture;

    private Date birthday;

    private boolean newUser;

    public AppUserDto() {
    }

    public AppUserDto(String email, String name, String picture, Date birthday, boolean newUser) {
        this.email = email;
        this.name = name;
        this.picture = picture;
        this.birthday = birthday;
        this.newUser = newUser;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Date getBirthday() {
        return birthday;
    }

    public void setBirthday(Date birthday) {
        this.birthday = birthday;
    }
}
