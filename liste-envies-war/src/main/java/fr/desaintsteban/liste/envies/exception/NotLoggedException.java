package fr.desaintsteban.liste.envies.exception;

public class NotLoggedException extends RuntimeException {
    public NotLoggedException() {
        super("Please log in");
    }
}
