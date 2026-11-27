package fr.desaintsteban.liste.envies.servlet;

import jakarta.servlet.FilterChain;
import jakarta.servlet.FilterConfig;
import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.Test;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class HistoryApiFallbackFilterTest {

    private HistoryApiFallbackFilter filter() throws Exception {
        HistoryApiFallbackFilter f = new HistoryApiFallbackFilter();
        FilterConfig cfg = mock(FilterConfig.class);
        when(cfg.getInitParameter("forwardPath")).thenReturn("/index.html");
        f.init(cfg);
        return f;
    }

    private HttpServletRequest request(String uri, RequestDispatcher dispatcher) {
        HttpServletRequest req = mock(HttpServletRequest.class);
        when(req.getMethod()).thenReturn("GET");
        when(req.getHeader("Accept")).thenReturn("text/html,application/xhtml+xml");
        when(req.getRequestURI()).thenReturn(uri);
        when(req.getRequestDispatcher("/index.html")).thenReturn(dispatcher);
        return req;
    }

    @Test
    public void routeSpaRenvoieIndexAvecRevalidation() throws Exception {
        RequestDispatcher dispatcher = mock(RequestDispatcher.class);
        HttpServletResponse resp = mock(HttpServletResponse.class);
        filter().doFilter(request("/noel", dispatcher), resp, mock(FilterChain.class));
        verify(resp).setHeader("Cache-Control", "no-cache");
        verify(dispatcher).forward(any(), any());
    }

    @Test
    public void fichierAvecPointNestPasModifie() throws Exception {
        RequestDispatcher dispatcher = mock(RequestDispatcher.class);
        HttpServletResponse resp = mock(HttpServletResponse.class);
        FilterChain chain = mock(FilterChain.class);
        filter().doFilter(request("/main-ABC.js", dispatcher), resp, chain);
        verify(resp, never()).setHeader(eq("Cache-Control"), any());
        verify(chain).doFilter(any(), any());
        verify(dispatcher, never()).forward(any(), any());
    }
}
