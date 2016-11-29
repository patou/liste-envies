package fr.desaintsteban.liste.envies.model;

import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.Cache;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;

@Cache
@Entity
public class AppUser {
	@Id
	private String email;

	private String name;

    private Boolean isAdmin;
	
	public AppUser() { }
	
	public AppUser(String email, String name) {
		this.name = name;
		this.email = email;
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
}