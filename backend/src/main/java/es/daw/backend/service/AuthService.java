package es.daw.backend.service;

import es.daw.backend.dto.AuthRequest;
import es.daw.backend.dto.AuthResponse;
import es.daw.backend.dto.RegisterRequest;
import es.daw.backend.entity.Usuario;
import es.daw.backend.exception.EmailAlreadyExistsException;
import es.daw.backend.exception.UserNotFoundException;
import es.daw.backend.repository.UsuarioRepository;
import es.daw.backend.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

        private final UsuarioRepository usuarioRepository;
        private final PasswordEncoder passwordEncoder;
        private final JwtService jwtService;
        private final AuthenticationManager authenticationManager;

        public AuthResponse register(RegisterRequest request) {
                if (usuarioRepository.findByEmail(request.getEmail()).isPresent()) {
                        throw new EmailAlreadyExistsException(request.getEmail());
                }

                Usuario user = Usuario.builder()
                                .nombre(request.getNombre()) // ----------añadido
                                .email(request.getEmail())
                                .password(passwordEncoder.encode(request.getPassword()))
                                .rol("USER") // Seguridad: siempre USER por defecto
                                .build();

                usuarioRepository.save(user);
                String jwtToken = jwtService.generateToken(user);
                // <--- NUEVO: Devolvemos el rol en la respuesta
                return AuthResponse.builder()
                                .token(jwtToken)
                                .rol(user.getRol())
                                .build();
        }

        public AuthResponse login(AuthRequest request) {
                authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

                Usuario user = usuarioRepository.findByEmail(request.getEmail())
                                .orElseThrow(() -> new UserNotFoundException("Usuario no encontrado"));

                String jwtToken = jwtService.generateToken(user);
                // <--- NUEVO: Devolvemos el rol en la respuesta
                return AuthResponse.builder()
                                .token(jwtToken)
                                .rol(user.getRol())
                                .build();
        }
}
