package uk.ac.bham.teamproject.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import uk.ac.bham.teamproject.domain.Song;

/**
 * Spring Data JPA repository for the Song entity.
 */
@Repository
public interface SongRepository extends JpaRepository<Song, Long> {
    default Optional<Song> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Song> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Song> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct song from Song song left join fetch song.likedSong left join fetch song.dislikedSong",
        countQuery = "select count(distinct song) from Song song"
    )
    Page<Song> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct song from Song song left join fetch song.likedSong left join fetch song.dislikedSong")
    List<Song> findAllWithToOneRelationships();

    @Query("select song from Song song left join fetch song.likedSong left join fetch song.dislikedSong where song.id =:id")
    Optional<Song> findOneWithToOneRelationships(@Param("id") Long id);
}