package fr.desaintsteban.liste.envies.dto;

import java.util.Date;

/**
 * Created by EDE3238 on 30/11/2016.
 */
public class NoteDto {


    private Long id;

    private Date date;

    private String text;

    private String owner;

    public String getOwner() {
        return owner;
    }

    public void setOwner(String owner) {
        this.owner = owner;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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



    public NoteDto() {

    }
    /**
     * Add a new Note
     * @param id
     * @param owner
     * @param text
     * @param date
     */
    public NoteDto(Long id, String owner, String text, Date date) {
        this.id = id;
        this.owner = owner;
        this.text = text;
        this.date = date;
    }
}
