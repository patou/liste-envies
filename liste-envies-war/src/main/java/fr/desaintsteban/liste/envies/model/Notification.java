package fr.desaintsteban.liste.envies.model;

import com.googlecode.objectify.annotation.*;
import fr.desaintsteban.liste.envies.dto.NotificationDto;
import fr.desaintsteban.liste.envies.enums.NotificationType;

import java.util.Date;
import java.util.List;


/**
 * Class pour stocker toutes les modifications faites sur les listes, afin d'afficher et notifier tous les changements.
 *
 */
@Entity
public class Notification {
    @Id
    Long id;

    @Index
    List<String> user;

    NotificationType type;

    String listName;

    String listId;

    String actionUser;

    String actionUserName;

    String actionUserPicture;

    public Long getWishId() {
        return wishId;
    }

    public void setWishId(Long wishId) {
        this.wishId = wishId;
    }

    Long wishId;

    @Index
    Date date;

    public String getActionUserPicture() {
        return actionUserPicture;
    }

    public void setActionUserPicture(String actionUserPicture) {
        this.actionUserPicture = actionUserPicture;
    }

    String message;

    public NotificationDto toDto() {
        NotificationDto dto = new NotificationDto();
        dto.setDate(this.getDate());
        dto.setListName(this.getListName());
        dto.setListId(this.getListId());
        dto.setType(this.getType());
        dto.setMessage(this.getMessage());
        dto.setActionUser(this.getActionUser());
        dto.setActionUserName(this.getActionUserName());
        dto.setActionUserPicture(this.getActionUserPicture());
        dto.setWishId(this.getWishId());
        return dto;
    }

    public NotificationType getType() {
        return type;
    }

    public void setType(NotificationType type) {
        this.type = type;
    }

    public String getListName() {
        return listName;
    }

    public void setListName(String listName) {
        this.listName = listName;
    }

    public String getListId() {
        return listId;
    }

    public void setListId(String listId) {
        this.listId = listId;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public List<String> getUser() {
        return user;
    }

    public void setUser(List<String> user) {
        this.user = user;
    }

    public String getActionUser() {
        return actionUser;
    }

    public void setActionUser(String actionUser) {
        this.actionUser = actionUser;
    }

    public String getActionUserName() {
        return actionUserName;
    }

    public void setActionUserName(String actionUserName) {
        this.actionUserName = actionUserName;
    }
}
