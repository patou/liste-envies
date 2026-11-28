package fr.desaintsteban.liste.envies.servlet;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.FilterConfig;
import jakarta.servlet.ServletContext;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.InputStream;
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
    private ServletContext servletContext;

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

	/** /index.html demande directement : meme traitement que les routes de l'application. */
	private boolean isIndexPath(String path) {
		return "/index.html".equals(path);
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
			(pathIncludesDot(requestURI) && !isIndexPath(requestURI)) ||
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
			// Prevent the next request from hitting this filter
			request.setAttribute(REENTRANCY_KEY, Boolean.TRUE);
			// index.html référence des fichiers à noms hachés qui disparaissent à chaque déploiement :
			// on demande aux navigateurs et caches de le revalider (no-cache = revalider, pas "ne jamais stocker").
			response.setHeader("Cache-Control", "no-cache");
			// Le conteneur date index.html du 01/01/1980 pour tous les deploiements et sans ETag : un navigateur qui
			// revalide avec If-Modified-Since recevrait toujours 304 et garderait un index perime (fichiers haches
			// disparus = page blanche). On renvoie donc nous-memes l'index (200 complet, sans Last-Modified).
			if (!writeIndex(response)) {
				// Repli : le conteneur sert index.html (Last-Modified fixe = 304 possible sur un index perime) :
				// no-store empeche le navigateur de garder cette reponse et donc de la revalider.
				LOGGER.warning("index.html illisible via le ServletContext : repli sur le conteneur avec no-store");
				response.setHeader("Cache-Control", "no-store");
				request.getRequestDispatcher(forwardPath).forward(request, response);
			}
		}
	}

	/** Ecrit index.html dans la reponse ; false si la ressource n'est pas lisible (on retombe sur le forward). */
	private boolean writeIndex(HttpServletResponse response) throws IOException {
		if (servletContext == null) {
			return false;
		}
		try (InputStream in = servletContext.getResourceAsStream(forwardPath)) {
			if (in == null) {
				return false;
			}
			byte[] content = in.readAllBytes();
			response.setContentType("text/html;charset=utf-8");
			response.setContentLength(content.length);
			response.getOutputStream().write(content);
			return true;
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
		servletContext = filterConfig.getServletContext();
		forwardPath = filterConfig.getInitParameter(FORWARD_PATH_CONFIG_PARAMETER);
		if (forwardPath == null) {
			throw new ServletException("Please set the '" + FORWARD_PATH_CONFIG_PARAMETER + "' servlet filter config as part of the " + REENTRANCY_KEY);
		}
	}
}
