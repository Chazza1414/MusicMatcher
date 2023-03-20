package uk.ac.bham.teamproject.service.song_serv_backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import uk.ac.bham.teamproject.domain.entity_backend.Song_Disliked_B;
import uk.ac.bham.teamproject.repository.repository_backend.Repo_Disliked_B;

import java.util.List;
import java.util.Optional;

@Service
public class Service_Disliked_B {

    @Autowired
    private Repo_Disliked_B dislikedSongRepository;

    public Song_Disliked_B save(Song_Disliked_B dislikedSong) {
        return dislikedSongRepository.save(dislikedSong);
    }

    public Optional<Song_Disliked_B> findById(Long id) {
        return dislikedSongRepository.findById(id);
    }

    public List<Song_Disliked_B> findAll() {
        return dislikedSongRepository.findAll();
    }

    public void deleteById(Long id) {
        dislikedSongRepository.deleteById(id);
    }
}
