package uk.ac.bham.teamproject.service.song_serv_backend;

import uk.ac.bham.teamproject.domain.entity_backend.Song_B;
import uk.ac.bham.teamproject.repository.repository_backend.Repo_Song_B;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class Service_Song_B {

    @Autowired
    private Repo_Song_B songRepository;

    public Song_B save(Song_B song) {
        return songRepository.save(song);
    }

    public List<Song_B> findAll() {
        return songRepository.findAll();
    }

    public Song_B findById(Long id) {
        return songRepository.findById(id).orElse(null);
    }

    public void deleteById(Long id) {
        songRepository.deleteById(id);
    }
}
