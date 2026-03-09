package es.daw.backend.controller;

import es.daw.backend.dto.AuthRequest;
import es.daw.backend.dto.AuthResponse;
import es.daw.backend.dto.RegisterRequest;
import es.daw.backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import es.daw.backend.service.RecaptchaService;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final RecaptchaService recaptchaService;

    // @Value("${recaptcha.project-id}")
    // private String projectId;

    // @Value("${recaptcha.secret-key}")
    // private String recaptchaSecretKey;

    // @PostMapping("/register")
    // public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest
    // request) {
    // return ResponseEntity.ok(authService.register(request));
    // }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        System.out.println("Token recibido: " + request.getRecaptchaToken()); // <-- añade esto
        if (!recaptchaService.validateToken(request.getRecaptchaToken())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "reCAPTCHA inválido"));
        }
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

}
