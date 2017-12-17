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

    public Person(boolean encoded) {
        this.encoded = encoded;
    }

    /**
     * Main creator
     * @param email
     * @param name
     * @param encoded
     */
    public Person(String email, String name, boolean encoded) {
        this(encoded);
        this.setEmail(email);
        this.setName(name);
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
        return EncodeUtils.decode(name, encoded);
    }

    public void setEmail(String email) {
        this.email = EncodeUtils.encode(email, encoded);
    }

    public String getName() {
        return EncodeUtils.decode(name, encoded);
    }

    public void setName(String name) {
        this.name = EncodeUtils.encode(name, encoded);
    }

    public static Person fromDto(PersonDto dto) {
        return fromDto(dto, false);
    }

    public static Person encodeFromDto(PersonDto dto) {
        return fromDto(dto, true);
    }

    public static Person fromDto(PersonDto dto, boolean encode) {
        if (dto != null) {
            return new Person(dto.getEmail(), dto.getName(), encode);
        }
        return null;
    }

    public static PersonDto toDto(Person person) {
        if (person != null) {
            return new PersonDto(person.getEmail(), person.getName());
        }
        return null;
    }
}
