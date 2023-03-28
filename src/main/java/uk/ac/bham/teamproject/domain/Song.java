package uk.ac.bham.teamproject.domain;

import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Song.
 */
@Entity
@Table(name = "song")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Song implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "spotify_song_id", nullable = false)
    private String spotifySongId;

    @NotNull
    @Column(name = "song_name", nullable = false)
    private String songName;

    @NotNull
    @Column(name = "spotify_artist_id", nullable = false)
    private String spotifyArtistId;

    @NotNull
    @Column(name = "artist_name", nullable = false)
    private String artistName;

    @ManyToOne
    private User user;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Song id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSpotifySongId() {
        return this.spotifySongId;
    }

    public Song spotifySongId(String spotifySongId) {
        this.setSpotifySongId(spotifySongId);
        return this;
    }

    public void setSpotifySongId(String spotifySongId) {
        this.spotifySongId = spotifySongId;
    }

    public String getSongName() {
        return this.songName;
    }

    public Song songName(String songName) {
        this.setSongName(songName);
        return this;
    }

    public void setSongName(String songName) {
        this.songName = songName;
    }

    public String getSpotifyArtistId() {
        return this.spotifyArtistId;
    }

    public Song spotifyArtistId(String spotifyArtistId) {
        this.setSpotifyArtistId(spotifyArtistId);
        return this;
    }

    public void setSpotifyArtistId(String spotifyArtistId) {
        this.spotifyArtistId = spotifyArtistId;
    }

    public String getArtistName() {
        return this.artistName;
    }

    public Song artistName(String artistName) {
        this.setArtistName(artistName);
        return this;
    }

    public void setArtistName(String artistName) {
        this.artistName = artistName;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Song user(User user) {
        this.setUser(user);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Song)) {
            return false;
        }
        return id != null && id.equals(((Song) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Song{" +
            "id=" + getId() +
            ", spotifySongId='" + getSpotifySongId() + "'" +
            ", songName='" + getSongName() + "'" +
            ", spotifyArtistId='" + getSpotifyArtistId() + "'" +
            ", artistName='" + getArtistName() + "'" +
            "}";
    }
}
