package fr.desaintsteban.liste.envies.servlet;

import fr.desaintsteban.liste.envies.rest.AppUserRestService;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.logging.Logger;

/**
 * Implements Single Page Application logic for dealing with navigation
 * using the HTML5 History API.
 *
 * Inspiration: https://github.com/bripkens/connect-history-api-fallback/
 */
public class HistoryApiFallbackFilter implements Filter {

	private static final String REENTRANCY_KEY = HistoryApiFallbackFilter.class.getName();
	private static final Logger LOGGER = Logger.getLogger(HistoryApiFallbackFilter.class.getName());

	protected static String FORWARD_PATH_CONFIG_PARAMETER = "forwardPath";
    protected static String forwardPath = null;

	/** */
	private boolean isGet(String method) {
		return method.equals("GET");
	}

	/** */
	private boolean hasHeader(String header) {
		return header != null && header.length() > 0;
	}

	/** */
	private boolean isApplicationJson(String header) {
		return header.contains("application/json");
	}

	/** */
	private boolean acceptsHtml(String header) {
		return header.contains("text/html") || header.contains("*/*");
	}

	/** */
	private boolean pathIncludesDot(String path) {
		return path != null && path.indexOf('.') != -1;
	}

	private boolean pathStart(String path, String prefix) {
		return path != null && path.startsWith("/" + prefix);
	}

	/** */
	@Override
	public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
		HttpServletRequest request = ((HttpServletRequest) servletRequest);
		HttpServletResponse response = ((HttpServletResponse) servletResponse);

		String method = request.getMethod().toUpperCase();
		String accept = request.getHeader("Accept");
		if (accept != null)
			accept = accept.toLowerCase();
		String requestURI = request.getRequestURI();

		Object reentrancyKey = request.getAttribute(REENTRANCY_KEY);

		boolean doFilter = false;

		if (reentrancyKey != null ||
			!isGet(method) ||
			!hasHeader(accept) ||
			isApplicationJson(accept) ||
			!acceptsHtml(accept) ||
			pathIncludesDot(requestURI) ||
			pathStart(requestURI, "api")
				|| pathStart(requestURI, "user")
				|| pathStart(requestURI, "_ah")
				|| pathStart(requestURI, "admin")) {

			doFilter = true;
		}
		LOGGER.info("doFilter: " + doFilter + ", requestURI: " + requestURI);

		if (doFilter) {
			filterChain.doFilter(servletRequest, servletResponse);
		} else {
			LOGGER.info("doFilter: " + doFilter + ", requestURI: " + requestURI);
			// Prevent the next request from hitting this filter
			request.setAttribute(REENTRANCY_KEY, Boolean.TRUE);
			request.getRequestDispatcher(forwardPath).forward(request, response);
		}
	}

	/** */
	@Override
	public void destroy() {
		// ignore
	}

	/** */
	@Override
	public void init(FilterConfig filterConfig) throws ServletException {
		forwardPath = filterConfig.getInitParameter(FORWARD_PATH_CONFIG_PARAMETER);
		if (forwardPath == null) {
			throw new ServletException("Please set the '" + FORWARD_PATH_CONFIG_PARAMETER + "' servlet filter config as part of the " + REENTRANCY_KEY);
		}
	}
}