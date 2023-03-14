package uk.ac.bham.teamproject.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import uk.ac.bham.teamproject.domain.DislikedSong;

/**
 * Spring Data JPA repository for the DislikedSong entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DislikedSongRepository extends JpaRepository<DislikedSong, Long> {}
