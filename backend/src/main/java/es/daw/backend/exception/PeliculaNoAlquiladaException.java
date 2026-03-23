package es.daw.backend.exception;

public class PeliculaNoAlquiladaException extends RuntimeException {
    public PeliculaNoAlquiladaException(String message) {
        super(message);
    }
}