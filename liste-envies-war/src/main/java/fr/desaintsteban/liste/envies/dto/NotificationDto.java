package fr.desaintsteban.liste.envies.dto;

import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.*;
import fr.desaintsteban.liste.envies.model.*;
import org.codehaus.jackson.annotate.JsonIgnore;

import java.util.Date;



public class NotificationDto {


    private Long id;



    public String getParentListName() {
        return parentListName;
    }

    public void setParentListName(String parentListName) {
        this.parentListName = parentListName;
    }

    /** List name for getting the url to list **/
    private String parentListName;



    private String ownerEmail;

    private AppUserDto owner;

    public String getOwnerEmail() {
        return ownerEmail;
    }

    public void setOwnerEmail(String ownerEmail) {
        this.ownerEmail = ownerEmail;
    }

    public AppUserDto getOwner() {
        return owner;
    }

    public void setOwner(AppUserDto owner) {
        this.owner = owner;
        this.setOwnerEmail(owner.getEmail());
    }


    public UserShareDto getAddedUser() {
        return addedUser;
    }

    public void setAddedUser(UserShareDto addedUser) {
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

    private UserShareDto addedUser;

    /**
     * Afin de savoir si c'est une modification faites par un owner ou un shared. car dans le cas d'une modif d'un shared,
     * Il ne faut pas l'afficher pour les owners.
     */

    private UserShareType ownerType;

    private NotificationType notificationType;


    private Date date;

    private EnvyDto wish;

    private String message;




    public NotificationDto() {
        this.date = new Date();
    }





    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public EnvyDto getWish() {
        return wish;
    }

    public void setWish(EnvyDto wish) {
        this.wish = wish;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }


}
