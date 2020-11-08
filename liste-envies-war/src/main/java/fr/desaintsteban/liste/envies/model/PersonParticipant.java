package fr.desaintsteban.liste.envies.model;

import fr.desaintsteban.liste.envies.dto.PersonParticipantDto;
import fr.desaintsteban.liste.envies.util.EncodeUtils;

public class PersonParticipant extends Person {
    String amount;
    String message;

    public PersonParticipant() {
    }

    public PersonParticipant(String email) {
        super(email, true);
    }

    public PersonParticipant(String email, String name, String picture, String amount, String message) {
        super(email, name, true, picture);
        this.amount = amount;
        this.message = message;
    }

    public PersonParticipant(AppUser user, String amount, String message) {
        super(user, true);
        this.amount = amount;
        this.message = message;
    }

    public String getAmount() {
        return amount;
    }

    public void setAmount(String amount) {
        this.amount = amount;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public PersonParticipantDto toDecodeDto() {
        return new PersonParticipantDto(EncodeUtils.decode(email), EncodeUtils.decode(name),  EncodeUtils.decode(picture), EncodeUtils.decode(amount), EncodeUtils.decode(message));
    }

    public static PersonParticipant fromDto(PersonParticipantDto person) {
        if (person != null) {
            return new PersonParticipant(EncodeUtils.encode(person.getEmail()), EncodeUtils.encode(person.getName()), EncodeUtils.encode(person.getPicture()), EncodeUtils.encode(person.getAmount()), EncodeUtils.encode(person.getMessage()));
        }
        return null;
    }
}
