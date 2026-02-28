package es.daw.backend.controller;

import es.daw.backend.dto.*;
import es.daw.backend.model.Usuario;
import es.daw.backend.repository.UsuarioRepository;
import es.daw.backend.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        // Comprobar si el email ya está en uso
        if (usuarioRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Error: El email ya está registrado");
        }
        // 1. Crear el nuevo usuario y encriptar la contraseña
        Usuario user = Usuario.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .rol(request.getRol() == null ? "USER" : request.getRol())
                .build();

        usuarioRepository.save(user);

        // 2. Generar el token para que el usuario entre directamente
        String jwtToken = jwtService.generateToken(user);
        return ResponseEntity.ok(AuthResponse.builder().token(jwtToken).build());
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        // 1. Autenticar las credenciales (Spring Security lo hace por ti)
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        // 2. Si las credenciales son correctas, buscar al usuario y generar el token
        Usuario user = usuarioRepository.findByEmail(request.getEmail()).orElseThrow();
        String jwtToken = jwtService.generateToken(user);

        return ResponseEntity.ok(AuthResponse.builder().token(jwtToken).build());
    }
}
