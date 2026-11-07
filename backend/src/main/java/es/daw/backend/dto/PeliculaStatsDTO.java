package es.daw.backend.dto;

public class PeliculaStatsDTO {

    private Long id;
    private String tmdbId;
    private String titulo;
    private Long totalFavoritos;
    private Long totalAlquileres;
    private Double notaMedia;

    public PeliculaStatsDTO() {
    }

    public PeliculaStatsDTO(
            Long id,
            String tmdbId,
            String titulo,
            Long totalFavoritos,
            Long totalAlquileres,
            Double notaMedia
    ) {
        this.id = id;
        this.tmdbId = tmdbId;
        this.titulo = titulo;
        this.totalFavoritos = totalFavoritos;
        this.totalAlquileres = totalAlquileres;
        this.notaMedia = notaMedia != null
                ? Math.round(notaMedia * 10.0) / 10.0
                : 0.0;
    }

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

    public Double getNotaMedia() {
        return notaMedia;
    }

    public void setNotaMedia(Double notaMedia) {
        this.notaMedia = notaMedia;
    }
}