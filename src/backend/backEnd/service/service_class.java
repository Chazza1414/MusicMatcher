package uk.ac.bham.teamproject.web.rest.backEnd.service;

import uk.ac.bham.teamproject.web.rest.backEnd.model;
import uk.ac.bham.teamproject.web.rest.backEnd.repository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SongService {

    @Autowired
    private SongRepository songRepository;

    public Song addSong(String name, String artist, String album) {
        Song song = new Song(name, artist, album);
        return songRepository.save(song);
    }

    public Song getSongById(Long id) {
        return songRepository.findById(id).orElse(null);
    }

    public void deleteSong(Long id) {
        songRepository.deleteById(id);
    }

    // Add more methods as needed
}
