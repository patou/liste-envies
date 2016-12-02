package fr.desaintsteban.liste.envies.model;

import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.Cache;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Parent;
import fr.desaintsteban.liste.envies.dto.EnvyDto;
import fr.desaintsteban.liste.envies.dto.NoteDto;
import fr.desaintsteban.liste.envies.util.EncodeUtils;
import org.codehaus.jackson.annotate.JsonIgnore;

import javax.jdo.annotations.Embedded;
import java.util.ArrayList;
import java.util.List;

/**
 * 01/10/2014.
 */
@Cache
@Entity
public class Envy {

    @Parent
    @JsonIgnore
    Key<ListEnvies> list;
    @Id
    private Long id;

    private String label;

    private String description;

    private String price;
    private String url;
    private String userTake;

    @Embedded
    private List<Note> notes;


    public Envy() {
        this.notes = new ArrayList<>();
    }

    public Envy(ListEnvies list, String label) {
        this.list = Key.create(list);
        this.label = label;
        this.notes = new ArrayList<>();
    }


    public Envy(EnvyDto envie) {
        setId(envie.getId());
        setLabel(envie.getLabel());
        setDescription(envie.getDescription());
        setPrice(envie.getPrice());
        setUrl(envie.getUrl());
        setUserTake(EncodeUtils.encode(envie.getUserTake()));

        this.notes = new ArrayList<>();

    }

    public EnvyDto toDto() {
        EnvyDto envie = new EnvyDto();
        envie.setId(getId());
        envie.setLabel(getLabel());
        envie.setDescription(getDescription());
        envie.setPrice(getPrice());
        envie.setUrl(getUrl());
        envie.setUserTake(EncodeUtils.decode(getUserTake()));

        if (this.notes != null && !this.notes.isEmpty()) {
            List<NoteDto> listNoteDto = new ArrayList<>();
            for (Note note : this.notes) {
                listNoteDto.add(note.toDto());
            }
            envie.setNotes(listNoteDto);
        }
        return envie;
    }

    public Key<ListEnvies> getOwner() {
        return list;
    }

    public void setOwner(Key<ListEnvies> owner) {
        this.list = owner;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPrice() {
        return price;
    }

    public void setPrice(String price) {
        this.price = price;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getUserTake() {
        return userTake;
    }

    public void setUserTake(String userTake) {
        this.userTake = userTake;
    }

    public void addNote(String owner, String email, String text) {
        this.notes.add(new Note(owner, email, text));
    }

    public List<Note> getNotes () {
        return this.notes;
    }

    public void setNotes(List<Note> notes) {
        this.notes = notes;
    }
}
