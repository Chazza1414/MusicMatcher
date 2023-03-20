package uk.ac.bham.teamproject.repository.repository_backend;

import uk.ac.bham.teamproject.domain.entity_backend.Song_Disliked_B;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface Repo_Disliked_B extends JpaRepository<Song_Disliked_B, Long> {
}
