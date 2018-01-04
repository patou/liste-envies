package fr.desaintsteban.liste.envies.servlet;
import java.io.IOException;
import java.util.Date;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import fr.desaintsteban.liste.envies.model.AppUser;
import fr.desaintsteban.liste.envies.service.AppUserService;
import fr.desaintsteban.liste.envies.util.ServletUtils;

public class GetUserServlet extends HttpServlet {
	public void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
		resp.setContentType("application/json");
		AppUser userAuthenticated = ServletUtils.getUserAuthenticated();
		userAuthenticated.setLastNotification(userAuthenticated.getLastVisit());
		userAuthenticated.setLastVisit(new Date());
		AppUserService.createOrUpdate(userAuthenticated);
		resp.getWriter().println(ServletUtils.toJson(userAuthenticated));
	}
}
