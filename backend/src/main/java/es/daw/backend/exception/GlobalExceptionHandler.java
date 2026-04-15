package es.daw.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.security.authentication.BadCredentialsException;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(EmailAlreadyExistsException.class)
    public ResponseEntity<Map<String, String>> handleEmailExists(EmailAlreadyExistsException ex) {
        Map<String, String> response = new HashMap<>();
        response.put("error", ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleUserNotFound(UserNotFoundException ex) {
        Map<String, String> response = new HashMap<>();
        response.put("error", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Map<String, String>> handleBadCredentials(BadCredentialsException ex) {
        Map<String, String> response = new HashMap<>();
        response.put("error", "Credenciales inválidas");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }

    @ExceptionHandler(RecaptchaException.class)
    public ResponseEntity<Map<String, String>> handleRecaptchaException(RecaptchaException ex) {
        Map<String, String> response = new HashMap<>();
        response.put("error", ex.getMessage());
        // Devolvemos 400 Bad Request porque es un fallo de validación del formulario
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(PeliculaNoAlquiladaException.class)
    public ResponseEntity<Map<String, String>> handlePeliculaNoAlquilada(PeliculaNoAlquiladaException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("error", "Acceso denegado");
        error.put("mensaje", ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.FORBIDDEN); // 403 Forbidden
    }

    @ExceptionHandler(PeliculaAlreadyExistsException.class)
    public ResponseEntity<Map<String, Object>> handlePeliculaAlreadyExistsException(PeliculaAlreadyExistsException ex) {
        Map<String, Object> response = new HashMap<>();
        response.put("error", "Conflict");
        response.put("message", ex.getMessage());
        response.put("status", HttpStatus.CONFLICT.value()); // HTTP 409
        response.put("timestamp", LocalDateTime.now());

        return new ResponseEntity<>(response, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(AlquilerNoActivoException.class)
    public ResponseEntity<Map<String, String>> handleAlquilerNoActivo(AlquilerNoActivoException ex) {
        Map<String, String> response = new HashMap<>();
        response.put("error", "Conflicto de Alquiler");
        response.put("mensaje", ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }
}
