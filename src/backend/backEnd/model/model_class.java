package uk.ac.bham.teamproject.web.rest.backEnd.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class Song {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String name;
    private String duration;
    private String artist;
    private String album;

    public Song() {}

    public Song(String name, String duration, String artist, String album) {
        this.name = name;
        this.duration = duration;
        this.artist = artist;
        this.album = album;
    }

    // getters and setters
}
