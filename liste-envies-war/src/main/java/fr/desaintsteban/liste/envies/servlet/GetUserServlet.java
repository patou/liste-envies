package fr.desaintsteban.liste.envies.servlet;

import fr.desaintsteban.liste.envies.model.AppUser;
import fr.desaintsteban.liste.envies.service.AppUserService;
import fr.desaintsteban.liste.envies.util.ServletUtils;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Date;
import java.util.concurrent.TimeUnit;

public class GetUserServlet extends HttpServlet {
	public void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
		resp.setContentType("application/json");
		AppUser userAuthenticated = ServletUtils.getUserAuthenticated();
		if (userAuthenticated == null) {
			return;
		}
		if (lastVisitDays(userAuthenticated.getLastVisit()) > 2) {
			userAuthenticated.setLastNotification(userAuthenticated.getLastVisit());
		}
		userAuthenticated.setLastVisit(new Date());
		AppUserService.createOrUpdate(userAuthenticated);
		resp.getWriter().println(ServletUtils.toJson(userAuthenticated));
	}

	private static long lastVisitDays(Date d1) {
		if (d1 == null)
			d1 = new Date();
		Date d2 = new Date();
		long diff = d2.getTime() - d1.getTime();
		return TimeUnit.HOURS.convert(diff, TimeUnit.MILLISECONDS);
	}
}
