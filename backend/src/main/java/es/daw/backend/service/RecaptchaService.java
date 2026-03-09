package es.daw.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class RecaptchaService {

    @Value("${google.recaptcha.api-key}")
    private String apiKey;

    @Value("${google.recaptcha.project-id}")
    private String projectId;

    @Value("${google.recaptcha.site-key}")
    private String siteKey;

    public boolean validateToken(String token) {
        // Si no hay token o usamos un token de bypass local temporal
        if (token == null || token.isEmpty()) {
            return false;
        }

        RestTemplate restTemplate = new RestTemplate();

        // 1. Construir la URL de reCAPTCHA Enterprise
        String url = String.format("https://recaptchaenterprise.googleapis.com/v1/projects/%s/assessments?key=%s", projectId, apiKey);

        // 2. Preparar las cabeceras
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // 3. Construir el cuerpo de la petición (JSON)
        Map<String, Object> event = new HashMap<>();
        event.put("token", token);
        event.put("siteKey", siteKey);
        event.put("expectedAction", "REGISTER"); // Nombre de la acción que realiza el usuario

        Map<String, Object> body = new HashMap<>();
        body.put("event", event);

        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(body, headers);

        try {
            // 4. Hacer la petición POST a Google Cloud
            Map<String, Object> response = restTemplate.postForObject(url, requestEntity, Map.class);

            // 5. Analizar la respuesta de Enterprise
            if (response != null && response.containsKey("tokenProperties")) {
                Map<String, Object> tokenProperties = (Map<String, Object>) response.get("tokenProperties");
                Boolean isValid = (Boolean) tokenProperties.get("valid");
                return isValid != null && isValid;
            }
            return false;
        } catch (Exception e) {
            System.err.println("Error de conexión con reCAPTCHA Enterprise: " + e.getMessage());
            return false; // Si falla la conexión, por seguridad denegamos el registro
        }
    }
}
