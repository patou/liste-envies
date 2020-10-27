package fr.desaintsteban.liste.envies.servlet;

import com.google.appengine.api.users.UserServiceFactory;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@SuppressWarnings("serial")
public class LoginServlet extends HttpServlet {
	public void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
    	String path = req.getParameter("path");
    	resp.sendRedirect(UserServiceFactory.getUserService().createLoginURL(path != null ? path : "/"));
	}
}
