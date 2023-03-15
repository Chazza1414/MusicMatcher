package uk.ac.bham.teamproject.domain.entity;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToOne;

import uk.ac.bham.teamproject.domain.entity.Song;
@Entity
public class LikedSong {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Boolean chosen;

    @OneToOne
    private Song song;

    // Getters and setters
}
