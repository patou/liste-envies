package fr.desaintsteban.liste.envies.dto;

public class PersonDto {
    String email;

    String name;



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

    public PersonDto() {
    }

    public PersonDto(String email, String name) {
        this.email = email;
        this.name = name;
    }
}
