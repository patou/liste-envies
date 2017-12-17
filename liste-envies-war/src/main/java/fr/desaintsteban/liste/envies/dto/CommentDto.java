package fr.desaintsteban.liste.envies.dto;

import fr.desaintsteban.liste.envies.enums.CommentType;

import java.util.Date;

/**
 *
 */
public class CommentDto {
    private Date date;

    private String text;

    private PersonDto from;

    private CommentType type;

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

    public CommentType getType() {
        return type;
    }

    public void setType(CommentType type) {
        this.type = type;
    }

    public CommentDto() {

    }
    /**
     * Add a new Comment
     * @param from
     * @param text
     * @param date
     * @param type
     */
    public CommentDto(PersonDto from, String text, Date date, CommentType type) {
        this.from = from;
        this.text = text;
        this.date = date;
        this.type = type;
    }
}
