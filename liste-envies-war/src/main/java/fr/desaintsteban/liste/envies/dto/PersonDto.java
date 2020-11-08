package fr.desaintsteban.liste.envies.dto;

public class PersonDto {
    String email;

    String name;


    String picture;



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

     public String getPicture() {
        return picture;
    }

    public void setPicture(String picture) {
        this.picture = picture;
    }

    public PersonDto() {
    }

    public PersonDto(String email, String name) {
        this.email = email;
        this.name = name;
    }

    public PersonDto(String email, String name, String picture) {
        this.email = email;
        this.name = name;
        this.picture = picture;
    }
}
