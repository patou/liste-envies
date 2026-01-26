package fr.desaintsteban.liste.envies.exception;

public class NotAllowedException extends RuntimeException {
    public NotAllowedException() {
        super("Not allowed to do this action");
    }
}
