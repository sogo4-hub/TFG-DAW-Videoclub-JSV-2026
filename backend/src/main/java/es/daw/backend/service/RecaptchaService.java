package es.daw.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class RecaptchaService {

    @Value("${google.recaptcha.secret}")
    private String secretKey;

    private static final String RECAPTCHA_VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";

    public boolean validateToken(String token) {
        RestTemplate restTemplate = new RestTemplate();

        // Construimos la URL de consulta para Google
        String url = String.format("%s?secret=%s&response=%s", RECAPTCHA_VERIFY_URL, secretKey, token);

        try {
            // Hacemos la llamada HTTP a Google
            Map<String, Object> response = restTemplate.postForObject(url, null, Map.class);
            return response != null && (Boolean) response.get("success");
        } catch (Exception e) {
            return false; // Si falla la conexión, por seguridad denegamos el registro
        }
    }
}
