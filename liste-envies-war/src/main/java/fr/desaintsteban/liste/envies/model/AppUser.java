package fr.desaintsteban.liste.envies.model;

import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.Cache;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;
import fr.desaintsteban.liste.envies.dto.AppUserDto;
import fr.desaintsteban.liste.envies.util.NicknameUtils;

import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Date;

@Cache
@Entity
public class AppUser {
	@Id
	private String email;

	private String name;

	private Date birthday;
	@Index
	private String anniversary;
	private String picture = "";

    private boolean isAdmin = false;

    private boolean newUser = false;

	private Date lastVisit;
	private Date lastNotification;
	private String loginProvider;
	
	public AppUser() { }

	public AppUser(String email) {
		this(email, NicknameUtils.getNickname(email));
	}

	public AppUser(String email, String name) {
		this.name = name;
		this.email = email;
	}

	public AppUser(String email, String name, Date birthday) {
		this(email, name);
		setBirthday(birthday);
	}
	
	public Key<AppUser> getKey() {
		return Key.create(AppUser.class, email);
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

	public Boolean getIsAdmin() {
        return isAdmin;
    }

	public Boolean isAdmin() {
		return isAdmin;
	}

    public void setIsAdmin(Boolean isAdmin) {
        this.isAdmin = isAdmin;
    }

	public Date getBirthday() {
		return birthday;
	}

	public void setBirthday(Date birthday) {
		this.birthday = birthday;
		if (birthday != null) {
			this.anniversary = birthday.toInstant().atZone(ZoneId.systemDefault()).toLocalDate().format(DateTimeFormatter.ofPattern("MM-dd"));
		}
	}

	public boolean isNewUser() {
		return newUser;
	}

	public void setNewUser(boolean newUser) {
		this.newUser = newUser;
	}

	public Date getLastVisit() {
		return lastVisit;
	}

	public void setLastVisit(Date lastVisit) {
		this.lastVisit = lastVisit;
	}

	public Date getLastNotification() {
		return lastNotification;
	}

	public void setLastNotification(Date lastNotification) {
		this.lastNotification = lastNotification;
	}

	public String getPicture() {
		return picture;
	}

	public void setPicture(String picture) {
		this.picture = picture;
	}

	public AppUserDto toDto() {
		return new AppUserDto(this.getEmail(), this.getName(), this.getBirthday(), this.newUser);
	}

	public String getLoginProvider() {
		return loginProvider;
	}

	public void setLoginProvider(String loginProvider) {
		this.loginProvider = loginProvider;
	}
}