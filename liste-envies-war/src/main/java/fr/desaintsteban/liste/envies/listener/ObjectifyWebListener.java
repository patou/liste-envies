package fr.desaintsteban.liste.envies.listener;

import com.googlecode.objectify.ObjectifyService;
import fr.desaintsteban.liste.envies.service.OfyService;
import jakarta.servlet.ServletContextEvent;
import jakarta.servlet.ServletContextListener;
import jakarta.servlet.annotation.WebListener;

/**
 * Validates Objectify Service initialization at startup.
 */
@WebListener
public class ObjectifyWebListener implements ServletContextListener {

    @Override
    public void contextInitialized(ServletContextEvent sce) {
        // Initialize Objectify Service
        ObjectifyService.init();

        // Trigger registration of entities by accessing the factory
        // This ensures the static block in OfyService is executed
        OfyService.factory();
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        // No cleanup required for Objectify
    }
}
