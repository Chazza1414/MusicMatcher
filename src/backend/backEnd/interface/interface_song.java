package uk.ac.bham.teamproject.web.rest.backEnd.repository;

import uk.ac.bham.teamproject.web.rest.backEnd.model;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SongRepository extends JpaRepository<Song, Long> {

}
