package uk.ac.bham.teamproject.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A DislikedSong.
 */
@Entity
@Table(name = "disliked_song")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class DislikedSong implements Serializable {

    private static final long serialVersionUID = 1L;

    @NotNull
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id", nullable = false)
    private Long id;

    @NotNull
    @Column(name = "chosen", nullable = false)
    private Boolean chosen;

    @JsonIgnoreProperties(value = { "likedSong", "dislikedSong", "mainPage" }, allowSetters = true)
    @OneToOne(mappedBy = "dislikedSong")
    private Song song;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public DislikedSong id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boolean getChosen() {
        return this.chosen;
    }

    public DislikedSong chosen(Boolean chosen) {
        this.setChosen(chosen);
        return this;
    }

    public void setChosen(Boolean chosen) {
        this.chosen = chosen;
    }

    public Song getSong() {
        return this.song;
    }

    public void setSong(Song song) {
        if (this.song != null) {
            this.song.setDislikedSong(null);
        }
        if (song != null) {
            song.setDislikedSong(this);
        }
        this.song = song;
    }

    public DislikedSong song(Song song) {
        this.setSong(song);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof DislikedSong)) {
            return false;
        }
        return id != null && id.equals(((DislikedSong) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "DislikedSong{" +
            "id=" + getId() +
            ", chosen='" + getChosen() + "'" +
            "}";
    }
}
