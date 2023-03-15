package uk.ac.bham.teamproject.service.song;

import uk.ac.bham.teamproject.domain.entity.Song;
import uk.ac.bham.teamproject.repository.song.SongRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class SongService {

    @Autowired
    private SongRepository songRepository;

    public Song save(Song song) {
        return songRepository.save(song);
    }

    public List<Song> findAll() {
        return songRepository.findAll();
    }

    public Song findById(Long id) {
        return songRepository.findById(id).orElse(null);
    }

    public void deleteById(Long id) {
        songRepository.deleteById(id);
    }
}
