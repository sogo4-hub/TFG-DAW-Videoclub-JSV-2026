package es.daw.backend.dto;

public class CalificacionesResponse {
    private Long peliculaId;
    private Double notaMedia;
    private Long totalVotos;

    public CalificacionesResponse(Long peliculaId, Double notaMedia, Long totalVotos) {
        this.peliculaId = peliculaId;
        this.notaMedia = (notaMedia != null) ? Math.round(notaMedia * 10.0) / 10.0 : 0.0; // Redondea a 1 decimal
        this.totalVotos = (totalVotos != null) ? totalVotos : 0L;
    }

    public Long getPeliculaId() { return peliculaId; }
    public Double getNotaMedia() { return notaMedia; }
    public Long getTotalVotos() { return totalVotos; }
}