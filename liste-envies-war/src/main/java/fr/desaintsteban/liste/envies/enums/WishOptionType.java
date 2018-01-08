package fr.desaintsteban.liste.envies.enums;

/**
 * How can we share the list, the privacy
 */
public enum WishOptionType {
    NONE, //
    HIDDEN, // Hide all, not seen wish was given, or by who, Default for list. Actual functionality
    ANONYMOUS,  // Show that the wish was given, but not by who, this information was replaced, by "anonyme"
    ALL, // View given, and by who, expect Suggest
    ALL_SUGGEST // View all, and also suggest
}
