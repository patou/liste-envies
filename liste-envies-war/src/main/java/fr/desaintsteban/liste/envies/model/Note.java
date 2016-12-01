package fr.desaintsteban.liste.envies.model;

import com.googlecode.objectify.annotation.Id;
import fr.desaintsteban.liste.envies.dto.NoteDto;
import fr.desaintsteban.liste.envies.util.EncodeUtils;


import java.util.Date;

/**
 *
 */
public class Note {

    String owner;

    @Id
    private Long id;

    private Date date;

    private String text;

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

    public Note () {

    }

    /**
     * Add a new Note
     * @param owner
     * @param text
     */
    public Note(String owner, String text) {
        this.owner = EncodeUtils.encode(owner);
        this.text = EncodeUtils.encode(text);
        this.date = new Date();
    }

    public NoteDto toDto() {
        NoteDto note = new NoteDto();
        note.setId(getId());
        note.setOwner(EncodeUtils.decode(getOwner()));
        note.setText(EncodeUtils.decode(getText()));
        note.setDate(getDate());
        return note;
    }
}
