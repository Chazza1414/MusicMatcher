package uk.ac.bham.teamproject.repository.song;

import uk.ac.bham.teamproject.domain.entity.Song;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SongRepository extends JpaRepository<Song, Long> {
}
