package uk.ac.bham.teamproject.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import uk.ac.bham.teamproject.domain.MainPage;

/**
 * Spring Data JPA repository for the MainPage entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MainPageRepository extends JpaRepository<MainPage, Long> {}
