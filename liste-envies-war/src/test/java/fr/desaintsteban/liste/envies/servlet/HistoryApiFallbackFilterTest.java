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

    @Test
    public void indexEstEcritDirectementSansLastModifiedNiForward() throws Exception {
        HistoryApiFallbackFilter f = new HistoryApiFallbackFilter();
        FilterConfig cfg = mock(FilterConfig.class);
        jakarta.servlet.ServletContext ctx = mock(jakarta.servlet.ServletContext.class);
        when(cfg.getInitParameter("forwardPath")).thenReturn("/index.html");
        when(cfg.getServletContext()).thenReturn(ctx);
        when(ctx.getResourceAsStream("/index.html")).thenReturn(new java.io.ByteArrayInputStream("<html>idx</html>".getBytes()));
        f.init(cfg);

        RequestDispatcher dispatcher = mock(RequestDispatcher.class);
        HttpServletResponse resp = mock(HttpServletResponse.class);
        java.io.ByteArrayOutputStream out = new java.io.ByteArrayOutputStream();
        when(resp.getOutputStream()).thenReturn(new jakarta.servlet.ServletOutputStream() {
            public boolean isReady() { return true; }
            public void setWriteListener(jakarta.servlet.WriteListener l) { }
            public void write(int b) { out.write(b); }
        });
        HttpServletRequest req = request("/", dispatcher);
        when(req.getHeader("If-Modified-Since")).thenReturn("Tue, 01 Jan 1980 00:00:01 GMT");

        f.doFilter(req, resp, mock(FilterChain.class));

        verify(resp).setHeader("Cache-Control", "no-cache");
        verify(resp).setContentType("text/html;charset=utf-8");
        verify(resp, never()).setStatus(304);
        verify(resp, never()).setDateHeader(eq("Last-Modified"), anyLong());
        verify(dispatcher, never()).forward(any(), any());
        org.junit.jupiter.api.Assertions.assertEquals("<html>idx</html>", out.toString());
    }

    @Test
    public void indexHtmlDirectPasseParLeFiltreEtRepliNeRevalidePas() throws Exception {
        RequestDispatcher dispatcher = mock(RequestDispatcher.class);
        HttpServletResponse resp = mock(HttpServletResponse.class);
        FilterChain chain = mock(FilterChain.class);
        filter().doFilter(request("/index.html", dispatcher), resp, chain);
        // ServletContext absent dans ce test : repli sur le forward, avec no-store (jamais de revalidation 304)
        verify(resp).setHeader("Cache-Control", "no-store");
        verify(dispatcher).forward(any(), any());
        verify(chain, never()).doFilter(any(), any());
    }
}
