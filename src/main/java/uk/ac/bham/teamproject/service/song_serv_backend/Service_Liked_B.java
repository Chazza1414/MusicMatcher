package uk.ac.bham.teamproject.service.song_serv_backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import uk.ac.bham.teamproject.domain.entity_backend.Song_Liked_B;
import uk.ac.bham.teamproject.repository.repository_backend.Repo_Liked_B;

import java.util.List;
import java.util.Optional;

@Service
public class Service_Liked_B {

    @Autowired
    private Repo_Liked_B likedSongRepository;

    public Song_Liked_B save(Song_Liked_B likedSong) {
        return likedSongRepository.save(likedSong);
    }

    public Optional<Song_Liked_B> findById(Long id) {
        return likedSongRepository.findById(id);
    }

    public List<Song_Liked_B> findAll() {
        return likedSongRepository.findAll();
    }

    public void deleteById(Long id) {
        likedSongRepository.deleteById(id);
    }
}
