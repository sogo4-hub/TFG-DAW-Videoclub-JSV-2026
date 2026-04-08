package es.daw.backend.exception;

public class PeliculaAlreadyExistsException extends RuntimeException {
    public PeliculaAlreadyExistsException(String message) {
        super(message);
    }
}
