package fr.desaintsteban.liste.envies.dto;

import fr.desaintsteban.liste.envies.enums.NotificationType;

import java.util.Date;



public class NotificationDto {
    NotificationType type;

    String listName;

    String listId;

    Date date;

    String message;

    String actionUser;

    String actionUserName;

    public Long getWishId() {
        return wishId;
    }

    public void setWishId(Long wishId) {
        this.wishId = wishId;
    }

    Long wishId;

    String actionUserPicture;

    public String getActionUserPicture() {
        return actionUserPicture;
    }

    public void setActionUserPicture(String actionUserPicture) {
        this.actionUserPicture = actionUserPicture;
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
