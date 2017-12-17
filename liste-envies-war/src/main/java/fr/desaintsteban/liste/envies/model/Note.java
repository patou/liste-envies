package fr.desaintsteban.liste.envies.model;

import com.googlecode.objectify.annotation.AlsoLoad;
import fr.desaintsteban.liste.envies.dto.NoteDto;
import fr.desaintsteban.liste.envies.dto.PersonDto;
import fr.desaintsteban.liste.envies.enums.NoteType;
import fr.desaintsteban.liste.envies.util.EncodeUtils;
import fr.desaintsteban.liste.envies.util.NicknameUtils;

import java.util.Date;

/**
 *
 */
public class Note {

    private Person from;

    private Date date;

    private String text;

    private NoteType type = NoteType.PRIVATE;

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

    public NoteType getType() {
        return type;
    }

    public void setType(NoteType type) {
        this.type = type != null ? type : NoteType.PRIVATE;
    }

    public Note () {

    }

    /**
     * Add a new Note
     * @param from
     * @param text
     * @param type
     */
    public Note(PersonDto from, String text, NoteType type) {
        this.text = EncodeUtils.encode(text);
        this.from = new Person(EncodeUtils.encode(from.getEmail()), EncodeUtils.encode(from.getName()));
        this.type = type != null ? type : NoteType.PRIVATE;
        this.date = new Date();
    }

    // Migrate from old Note format
    void importPerson(@AlsoLoad("email") String emailEncoded) {
        if (emailEncoded != null) {
            String email = EncodeUtils.decode(emailEncoded);
            this.from = new Person(EncodeUtils.encode(email), EncodeUtils.encode(NicknameUtils.getNickname(email)));
        }
    }

    public NoteDto toDto() {
        NoteDto note = new NoteDto();
        note.setText(EncodeUtils.decode(getText()));
        Person person = getFrom();
        if (person != null) {
            PersonDto personDto = new PersonDto();
            personDto.setEmail(EncodeUtils.decode(person.getEmail()));
            personDto.setName(EncodeUtils.decode(person.getName()));
            note.setFrom(personDto);
        }
        note.setType(getType());
        note.setDate(getDate());
        return note;
    }

    public static Note fromDto(NoteDto dto, boolean encode) {
        if (dto != null) {
            Note note = new Note();
            note.setText(EncodeUtils.encode(dto.getText(), encode));
            note.setDate(dto.getDate());
            note.setFrom(Person.fromDto(dto.getFrom(), encode));
            note.setType(dto.getType());
            return note;
        }
        return null;
    }
}
