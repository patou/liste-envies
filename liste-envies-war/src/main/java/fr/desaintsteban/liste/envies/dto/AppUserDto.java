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

    private Date birthday;

    private boolean newUser;

    public AppUserDto() {
    }

    public AppUserDto(String email, String name, Date birthday, boolean newUser) {
        this.email = email;
        this.name = name;
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
