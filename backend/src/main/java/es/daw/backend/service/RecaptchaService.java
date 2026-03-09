package es.daw.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.Map;

@Service
public class RecaptchaService {
    @Value("${recaptcha.project-id}")
    private String projectId;

    @Value("${recaptcha.secret-key}")
    private String secretKey;

    @Value("${recaptcha.site-key}")
    private String siteKey;

    private final RestTemplate restTemplate = new RestTemplate();

    // public boolean validateToken(String token) {
    // if (token == null || token.isEmpty())
    // return false;

    // String url = "https://www.google.com/recaptcha/api/siteverify"
    // + "?secret=" + secretKey
    // + "&response=" + token;

    // try {
    // ResponseEntity<Map> response = restTemplate.postForEntity(url, null,
    // Map.class);
    // Map body = response.getBody();
    // System.out.println("Respuesta reCAPTCHA: " + body);
    // return Boolean.TRUE.equals(body.get("success"));
    // } catch (Exception e) {
    // System.err.println("Error validando reCAPTCHA: " + e.getMessage());
    // return false;
    // }
    // }

    public boolean validateToken(String token) {
        if (token == null || token.isEmpty())
            return false;

        String url = "https://recaptchaenterprise.googleapis.com/v1/projects/"
                + projectId + "/assessments?key=" + secretKey; // secretKey = AIzaSy...

        String payload = """
                {
                    "event": {
                        "token": "%s",
                        "siteKey": "%s"
                    }
                }
                """.formatted(token, siteKey);

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<String> entity = new HttpEntity<>(payload, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);

            Map body = response.getBody();
            System.out.println("Respuesta reCAPTCHA Enterprise: " + body);

            Map tokenProps = (Map) body.get("tokenProperties");
            return tokenProps != null && Boolean.TRUE.equals(tokenProps.get("valid"));

        } catch (Exception e) {
            System.err.println("Error validando reCAPTCHA: " + e.getMessage());
            return false;
        }
    }
}
