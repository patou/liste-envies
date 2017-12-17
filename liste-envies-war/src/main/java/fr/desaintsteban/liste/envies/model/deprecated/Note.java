package fr.desaintsteban.liste.envies.model.deprecated;

import fr.desaintsteban.liste.envies.enums.CommentType;
import fr.desaintsteban.liste.envies.model.Comment;
import fr.desaintsteban.liste.envies.model.Person;
import fr.desaintsteban.liste.envies.util.EncodeUtils;

import java.util.Date;

/**
 *
 */
@Deprecated
public class Note {

    private String owner;

    private String email;

    private Date date;

    private String text;

    public String getOwner() {
        return owner;
    }

    public void setOwner(String owner) {
        this.owner = owner;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
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
    public Note(String owner, String email, String text) {
        this.owner = EncodeUtils.encode(owner);
        this.text = EncodeUtils.encode(text);
        this.email = EncodeUtils.encode(email);
        this.date = new Date();
    }

    public Comment toComment() {
        Comment comment = new Comment();
        comment.setDate(getDate());
        comment.setText(EncodeUtils.decode(getText()));
        comment.setFrom(new Person( EncodeUtils.decode(getEmail()), EncodeUtils.decode(getOwner()), true));
        comment.setType(CommentType.PRIVATE);
        return comment;
    }
}