package uk.ac.bham.teamproject.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import uk.ac.bham.teamproject.domain.LikedSong;

/**
 * Spring Data JPA repository for the LikedSong entity.
 */
@SuppressWarnings("unused")
@Repository
public interface LikedSongRepository extends JpaRepository<LikedSong, Long> {}
