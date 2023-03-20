package uk.ac.bham.teamproject.domain.entity_backend;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToOne;

@Entity
public class Song_Liked_B {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Boolean chosen;

    @OneToOne
    private Song_B song;

    // Getters and setters
}
