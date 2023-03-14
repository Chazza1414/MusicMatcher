package uk.ac.bham.teamproject.web.rest.repository;

import uk.ac.bham.teamproject.web.rest.model;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SongRepository extends JpaRepository<Song, Long> {

}
