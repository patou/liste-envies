package fr.desaintsteban.liste.envies.servlet;
import java.io.IOException;
import java.util.Date;
import java.util.concurrent.TimeUnit;

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
		if (getDifferenceHours(userAuthenticated.getLastNotification(), userAuthenticated.getLastVisit()) > 2) {
			userAuthenticated.setLastNotification(userAuthenticated.getLastVisit());
		}
		userAuthenticated.setLastVisit(new Date());
		AppUserService.createOrUpdate(userAuthenticated);
		resp.getWriter().println(ServletUtils.toJson(userAuthenticated));
	}

	private static long getDifferenceHours(Date d1, Date d2) {
		if (d1 == null)
			d1 = new Date();
		if (d2 == null)
			d2 = new Date();
		long diff = d2.getTime() - d1.getTime();
		return TimeUnit.HOURS.convert(diff, TimeUnit.MILLISECONDS);
	}
}
