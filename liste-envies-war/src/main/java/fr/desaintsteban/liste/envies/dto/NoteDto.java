package fr.desaintsteban.liste.envies.dto;

import java.util.Date;

/**
 *
 */
public class NoteDto {
    private Date date;

    private String text;

    private String owner;

    private String email;

    public String getOwner() {
        return owner;
    }

    public void setOwner(String owner) {
        this.owner = owner;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public NoteDto() {

    }
    /**
     * Add a new Note
     * @param owner
     * @param text
     * @param date
     */
    public NoteDto(String owner, String email, String text, Date date) {
        this.owner = owner;
        this.email = email;
        this.text = text;
        this.date = date;
    }
}
