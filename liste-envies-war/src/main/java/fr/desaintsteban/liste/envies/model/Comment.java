package fr.desaintsteban.liste.envies.model;

import com.googlecode.objectify.annotation.AlsoLoad;
import fr.desaintsteban.liste.envies.dto.CommentDto;
import fr.desaintsteban.liste.envies.dto.PersonDto;
import fr.desaintsteban.liste.envies.enums.CommentType;
import fr.desaintsteban.liste.envies.util.EncodeUtils;
import fr.desaintsteban.liste.envies.util.NicknameUtils;

import java.util.Date;
import java.util.List;

/**
 *
 */
public class Comment {

    private Person from;

    private Date date;

    private String text;

    private CommentType type = CommentType.PRIVATE;

    private List<Comment> answer;

    public Person getFrom() {
        return from;
    }

    public void setFrom(Person from) {
        this.from = from;
    }

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

    public CommentType getType() {
        return type;
    }

    public void setType(CommentType type) {
        this.type = type != null ? type : CommentType.PRIVATE;
    }

    public List<Comment> getAnswer() {
        return answer;
    }

    public void setAnswer(List<Comment> answer) {
        this.answer = answer;
    }

    public Comment() {

    }

    /**
     * Add a new Comment
     * @param from
     * @param text
     * @param type
     */
    public Comment(PersonDto from, String text, CommentType type) {
        this.text = EncodeUtils.encode(text);
        this.from = new Person(EncodeUtils.encode(from.getEmail()), EncodeUtils.encode(from.getName()));
        this.type = type != null ? type : CommentType.PRIVATE;
        this.date = new Date();
    }

    public CommentDto toDto() {
        CommentDto commentDto = new CommentDto();
        commentDto.setText(EncodeUtils.decode(getText()));
        Person person = getFrom();
        if (person != null) {
            PersonDto personDto = new PersonDto();
            personDto.setEmail(EncodeUtils.decode(person.getEmail()));
            personDto.setName(EncodeUtils.decode(person.getName()));
            commentDto.setFrom(personDto);
        }
        commentDto.setType(getType());
        commentDto.setDate(getDate());
        return commentDto;
    }

    public static Comment fromDto(CommentDto dto, boolean encode) {
        if (dto != null) {
            Comment comment = new Comment();
            comment.setText(EncodeUtils.encode(dto.getText(), encode));
            comment.setDate(dto.getDate());
            comment.setFrom(Person.fromDto(dto.getFrom(), encode));
            comment.setType(dto.getType());
            return comment;
        }
        return null;
    }
}
