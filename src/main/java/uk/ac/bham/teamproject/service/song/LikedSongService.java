package uk.ac.bham.teamproject.service.song;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import uk.ac.bham.teamproject.domain.entity.LikedSong;
import uk.ac.bham.teamproject.repository.song.LikedSongRepository;

import java.util.List;
import java.util.Optional;

@Service
public class LikedSongService {

    @Autowired
    private LikedSongRepository likedSongRepository;

    public LikedSong save(LikedSong likedSong) {
        return likedSongRepository.save(likedSong);
    }

    public Optional<LikedSong> findById(Long id) {
        return likedSongRepository.findById(id);
    }

    public List<LikedSong> findAll() {
        return likedSongRepository.findAll();
    }

    public void deleteById(Long id) {
        likedSongRepository.deleteById(id);
    }
}
