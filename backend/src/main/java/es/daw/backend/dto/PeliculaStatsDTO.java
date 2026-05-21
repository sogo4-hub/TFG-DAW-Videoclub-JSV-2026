package es.daw.backend.dto;

public class PeliculaStatsDTO {
    
    private Long id;
    private String tmdbId;
    private String titulo;
    private Long totalFavoritos;
    private Long totalAlquileres;

    // 1. Constructor vacío (esencial para que Jackson serialice bien a JSON)
    public PeliculaStatsDTO() {
    }

    // 2. Constructor completo (el que usa la Query JPQL de tu PeliculaRepository)
    public PeliculaStatsDTO(Long id, String tmdbId, String titulo, Long totalFavoritos, Long totalAlquileres) {
        this.id = id;
        this.tmdbId = tmdbId;
        this.titulo = titulo;
        this.totalFavoritos = totalFavoritos;
        this.totalAlquileres = totalAlquileres;
    }

    // 3. Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTmdbId() {
        return tmdbId;
    }

    public void setTmdbId(String tmdbId) {
        this.tmdbId = tmdbId;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public Long getTotalFavoritos() {
        return totalFavoritos;
    }

    public void setTotalFavoritos(Long totalFavoritos) {
        this.totalFavoritos = totalFavoritos;
    }

    public Long getTotalAlquileres() {
        return totalAlquileres;
    }

    public void setTotalAlquileres(Long totalAlquileres) {
        this.totalAlquileres = totalAlquileres;
    }
}