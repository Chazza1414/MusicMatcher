package uk.ac.bham.teamproject.service.song;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import uk.ac.bham.teamproject.domain.entity.DislikedSong;
import uk.ac.bham.teamproject.repository.song.DislikedSongRepository;

import java.util.List;
import java.util.Optional;

@Service
public class DislikedSongService {

    @Autowired
    private DislikedSongRepository dislikedSongRepository;

    public DislikedSong save(DislikedSong dislikedSong) {
        return dislikedSongRepository.save(dislikedSong);
    }

    public Optional<DislikedSong> findById(Long id) {
        return dislikedSongRepository.findById(id);
    }

    public List<DislikedSong> findAll() {
        return dislikedSongRepository.findAll();
    }

    public void deleteById(Long id) {
        dislikedSongRepository.deleteById(id);
    }
}
