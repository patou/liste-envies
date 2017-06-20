package fr.desaintsteban.liste.envies.model;

import com.google.appengine.repackaged.com.google.api.client.util.DateTime;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.*;
import fr.desaintsteban.liste.envies.dto.NotificationDto;
import org.codehaus.jackson.annotate.JsonIgnore;

import java.util.Date;


/**
 * Class pour stocker toutes les modifications faites sur les listes, afin d'afficher et notifier tous les changements.
 *
 */
@Entity
public class Notification {

    @Id
    private Long id;


    Key<ListEnvies> parentListId;

    public String getParentListName() {
        return parentListName;
    }

    public void setParentListName(String parentListName) {
        this.parentListName = parentListName;
    }

    /** List name for getting the url to list **/
    @Index
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
        this.addedUserEmail = addedUser.getEmail();
        this.ownerType = addedUser.getType();
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


    private Date date;

    private Envy wish;

    private String message;




    public Notification() {
        this.date = new Date();
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

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
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

    public NotificationDto toDto() {
        NotificationDto dto = new NotificationDto();
        dto.setId(this.getId());
        dto.setParentListName(this.getParentListName());
        dto.setOwnerEmail(this.getOwnerEmail());
        dto.setOwner(this.getOwner().toDto());
        dto.setAddedUserEmail(this.getAddedUserEmail());
        if (this.addedUser != null) dto.setAddedUser(this.getAddedUser().toDto());
        dto.setOwnerType(this.getOwnerType());
        dto.setNotificationType(this.getNotificationType());
        dto.setDate(this.getDate());
        if (this.wish != null) dto.setWish(this.getWish().toDto());
        dto.setMessage(this.getMessage());
        return dto;
    }
}
