package es.daw.backend.service;

import es.daw.backend.dto.tmdb.TmdbMovieDTO;
import es.daw.backend.dto.tmdb.TmdbResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TmdbService {

    @Value("${tmdb.api.key}")
    private String apiKey;

    @Value("${tmdb.api.base-url}")
    private String baseUrl;

    private final RestTemplate restTemplate;

    // Busca una lista de películas por nombre
    public List<TmdbMovieDTO> searchMovies(String query) {
        String url = UriComponentsBuilder.fromHttpUrl(baseUrl + "/search/movie")
                .queryParam("api_key", apiKey)
                .queryParam("query", query)
                .queryParam("language", "es-ES")
                .toUriString();

        TmdbResponseDTO response = restTemplate.getForObject(url, TmdbResponseDTO.class);
        return (response != null && response.getResults() != null) ? response.getResults() : Collections.emptyList();
    }

    // Obtiene el detalle exacto de una película por su ID de TMDB
    public Optional<TmdbMovieDTO> getMovieDetails(Long tmdbId) {
        String url = UriComponentsBuilder.fromHttpUrl(baseUrl + "/movie/" + tmdbId)
                .queryParam("api_key", apiKey)
                .queryParam("language", "es-ES")
                .queryParam("append_to_response", "credits") // 🔥 LA MAGIA OCURRE AQUÍ
                .toUriString();

        try {
            TmdbMovieDTO movie = restTemplate.getForObject(url, TmdbMovieDTO.class);
            return Optional.ofNullable(movie);
        } catch (Exception e) {
            return Optional.empty();
        }
    }
}
