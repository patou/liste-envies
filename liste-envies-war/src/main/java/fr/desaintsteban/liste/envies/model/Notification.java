package fr.desaintsteban.liste.envies.model;

import com.google.appengine.repackaged.com.google.api.client.util.DateTime;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.*;
import org.codehaus.jackson.annotate.JsonIgnore;


/**
 * Class pour stocker toutes les modifications faites sur les listes, afin d'afficher et notifier tous les changements.
 *
 */
@Cache
@Entity
public class Notification {

    @Id
    private Long id;

    @Parent
    @JsonIgnore
    Key<ListEnvies> parentListId;

    public String getParentListName() {
        return parentListName;
    }

    public void setParentListName(String parentListName) {
        this.parentListName = parentListName;
    }

    /** List name for getting the url to list **/
    private String parentListName;

    public void setParentList(ListEnvies list) {
        this.parentListId = list.getKey();
        this.parentListName = list.getName();
    }

    @Index
    private String ownerEmail;

    private AppUser owner;

    public String getOwnerEmail() {
        return ownerEmail;
    }

    public void setOwnerEmail(String ownerEmail) {
        this.ownerEmail = ownerEmail;
    }

    public AppUser getOwner() {
        return owner;
    }

    public void setOwner(AppUser owner) {
        this.owner = owner;
        this.setOwnerEmail(owner.getEmail());
    }


    public UserShare getAddedUser() {
        return addedUser;
    }

    public void setAddedUser(UserShare addedUser) {
        this.addedUser = addedUser;
    }

    private String addedUserEmail;



    public String getAddedUserEmail() {
        return addedUserEmail;
    }

    public void setAddedUserEmail(String addedUserEmail) {
        this.addedUserEmail = addedUserEmail;
    }

    private UserShare addedUser;

    /**
     * Afin de savoir si c'est une modification faites par un owner ou un shared. car dans le cas d'une modif d'un shared,
     * Il ne faut pas l'afficher pour les owners.
     */
    @Index
    private UserShareType ownerType;

    private NotificationType notificationType;


    private DateTime date;

    private Envy wish;

    private String message;




    public Notification() {
    }





    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Key<ListEnvies> getParentListId() {
        return parentListId;
    }

    public void setParentListId(Key<ListEnvies> parentListId) {
        this.parentListId = parentListId;
    }



    public UserShareType getOwnerType() {
        return ownerType;
    }

    public void setOwnerType(UserShareType ownerType) {
        this.ownerType = ownerType;
    }

    public NotificationType getNotificationType() {
        return notificationType;
    }

    public void setNotificationType(NotificationType notificationType) {
        this.notificationType = notificationType;
    }

    public DateTime getDate() {
        return date;
    }

    public void setDate(DateTime date) {
        this.date = date;
    }

    public Envy getWish() {
        return wish;
    }

    public void setWish(Envy wish) {
        this.wish = wish;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }


}
