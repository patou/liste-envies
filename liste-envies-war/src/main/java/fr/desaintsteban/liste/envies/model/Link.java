package fr.desaintsteban.liste.envies.model;

/**
 */
public class Link {
    private String url;
    private String name;

    public Link() {
    }

    public Link(String url) {
        this.url = url;
    }

    public Link(String url, String name) {
        this.url = url;
        this.name = name;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
