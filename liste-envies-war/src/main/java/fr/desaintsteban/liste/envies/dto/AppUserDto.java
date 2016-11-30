package fr.desaintsteban.liste.envies.dto;

/**
 * Created by sfeir on 30/11/2016.
 */
public class AppUserDto {
    private String email;

    private String name;

    public AppUserDto() {
    }

    public AppUserDto(String email, String name) {
        this.email = email;
        this.name = name;
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
}
