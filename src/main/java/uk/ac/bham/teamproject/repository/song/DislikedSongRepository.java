package uk.ac.bham.teamproject.repository.song;

import uk.ac.bham.teamproject.domain.entity.DislikedSong;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DislikedSongRepository extends JpaRepository<DislikedSong, Long> {
}
