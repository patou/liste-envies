package fr.desaintsteban.liste.envies.servlet;
import java.io.IOException;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.appengine.api.users.UserServiceFactory;

@SuppressWarnings("serial")
public class LogoutServlet extends HttpServlet {
	public void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
		String path = req.getParameter("path");
		resp.sendRedirect(UserServiceFactory.getUserService().createLogoutURL(path != null ? path : "/"));
	}
}
