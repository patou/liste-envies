package fr.desaintsteban.liste.envies.dto;

import fr.desaintsteban.liste.envies.enums.NoteType;

import java.util.Date;

/**
 *
 */
public class NoteDto {
    private Date date;

    private String text;

    private PersonDto from;

    private NoteType type;

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date != null ? date : new Date();
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public PersonDto getFrom() {
        return from;
    }

    public void setFrom(PersonDto from) {
        this.from = from;
    }

    public NoteType getType() {
        return type;
    }

    public void setType(NoteType type) {
        this.type = type;
    }

    public NoteDto() {

    }
    /**
     * Add a new Note
     * @param from
     * @param text
     * @param date
     * @param type
     */
    public NoteDto(PersonDto from, String text, Date date, NoteType type) {
        this.from = from;
        this.text = text;
        this.date = date;
        this.type = type;
    }
}
