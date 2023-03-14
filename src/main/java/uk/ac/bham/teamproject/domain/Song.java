package uk.ac.bham.teamproject.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
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

    @NotNull
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id", nullable = false)
    private Long id;

    @NotNull
    @Column(name = "artist", nullable = false)
    private String artist;

    @NotNull
    @Column(name = "title", nullable = false)
    private String title;

    @JsonIgnoreProperties(value = { "song" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private LikedSong likedSong;

    @JsonIgnoreProperties(value = { "song" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private DislikedSong dislikedSong;

    @ManyToOne
    @JsonIgnoreProperties(value = { "user" }, allowSetters = true)
    private MainPage mainPage;

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

    public String getArtist() {
        return this.artist;
    }

    public Song artist(String artist) {
        this.setArtist(artist);
        return this;
    }

    public void setArtist(String artist) {
        this.artist = artist;
    }

    public String getTitle() {
        return this.title;
    }

    public Song title(String title) {
        this.setTitle(title);
        return this;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public LikedSong getLikedSong() {
        return this.likedSong;
    }

    public void setLikedSong(LikedSong likedSong) {
        this.likedSong = likedSong;
    }

    public Song likedSong(LikedSong likedSong) {
        this.setLikedSong(likedSong);
        return this;
    }

    public DislikedSong getDislikedSong() {
        return this.dislikedSong;
    }

    public void setDislikedSong(DislikedSong dislikedSong) {
        this.dislikedSong = dislikedSong;
    }

    public Song dislikedSong(DislikedSong dislikedSong) {
        this.setDislikedSong(dislikedSong);
        return this;
    }

    public MainPage getMainPage() {
        return this.mainPage;
    }

    public void setMainPage(MainPage mainPage) {
        this.mainPage = mainPage;
    }

    public Song mainPage(MainPage mainPage) {
        this.setMainPage(mainPage);
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
            ", artist='" + getArtist() + "'" +
            ", title='" + getTitle() + "'" +
            "}";
    }
}
