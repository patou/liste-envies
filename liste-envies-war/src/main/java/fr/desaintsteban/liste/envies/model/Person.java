package fr.desaintsteban.liste.envies.model;

import com.googlecode.objectify.annotation.Index;
import fr.desaintsteban.liste.envies.dto.PersonDto;
import fr.desaintsteban.liste.envies.util.EncodeUtils;
import fr.desaintsteban.liste.envies.util.NicknameUtils;

public class Person {
    @Index
    String email;
    String name;
    boolean encoded = true; // auto encode or decode if set to true.

    public Person() {
    }

    /**
     * Main creator
     * @param email
     * @param name
     * @param encoded
     */
    public Person(String email, String name, boolean encoded) {
        this.setEmail(email);
        this.setName(name);
        this.encoded = encoded;
    }

    public Person(String email, boolean encoded) {
        this(email, NicknameUtils.getNickname(email), encoded);
    }

    public Person(String email) {
        this(email, NicknameUtils.getNickname(email), true);
    }

    public Person(AppUser user, boolean encoded) {
        this(user.getEmail(), user.getName(), encoded);
    }

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

    public static Person fromDto(PersonDto dto) {
        return fromDto(dto, false);
    }

    public static Person encodeFromDto(PersonDto dto) {
        return fromDto(dto, true);
    }

    public static Person fromDto(PersonDto dto, boolean encode) {
        if (dto != null) {
            if (encode)
                return new Person(EncodeUtils.encode(dto.getEmail()), EncodeUtils.encode(dto.getName()));
            else {
                return new Person(dto.getEmail(), dto.getName());
            }
        }
        return null;
    }

    public static PersonDto toDto(Person person) {
        return toDto(person, false);
    }

    public static PersonDto decodeToDto(Person person) {
        return toDto(person, true);
    }

    public static PersonDto toDto(Person person, boolean decode) {
        if (person == null) {
            if (decode)
                return new PersonDto(EncodeUtils.decode(person.getEmail()), EncodeUtils.decode(person.getName()));
            else {
                return new PersonDto(person.getEmail(), person.getName());
            }
        }
        return null;
    }
}
