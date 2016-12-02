package fr.desaintsteban.liste.envies.dto;

import java.util.List;

/**
 * 01/10/2014.
 */
public class EnvyDto {
    private Long id;

    private String label;

    private String description;

    private String price;
    private String url;
    private String userTake;

    private List<NoteDto> notes;

    public EnvyDto() {
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

    public List<NoteDto> getNotes() {
        return notes;
    }

    public void setNotes(List<NoteDto> notes) {
        this.notes = notes;
    }
}
