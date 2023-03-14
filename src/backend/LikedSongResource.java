package uk.ac.bham.teamproject.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;
import uk.ac.bham.teamproject.domain.LikedSong;
import uk.ac.bham.teamproject.repository.LikedSongRepository;
import uk.ac.bham.teamproject.web.rest.errors.BadRequestAlertException;

/**
 * REST controller for managing {@link uk.ac.bham.teamproject.domain.LikedSong}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class LikedSongResource {

    private final Logger log = LoggerFactory.getLogger(LikedSongResource.class);

    private static final String ENTITY_NAME = "likedSong";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final LikedSongRepository likedSongRepository;

    public LikedSongResource(LikedSongRepository likedSongRepository) {
        this.likedSongRepository = likedSongRepository;
    }

    /**
     * {@code POST  /liked-songs} : Create a new likedSong.
     *
     * @param likedSong the likedSong to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new likedSong, or with status {@code 400 (Bad Request)} if the likedSong has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/liked-songs")
    public ResponseEntity<LikedSong> createLikedSong(@Valid @RequestBody LikedSong likedSong) throws URISyntaxException {
        log.debug("REST request to save LikedSong : {}", likedSong);
        if (likedSong.getId() != null) {
            throw new BadRequestAlertException("A new likedSong cannot already have an ID", ENTITY_NAME, "idexists");
        }
        LikedSong result = likedSongRepository.save(likedSong);
        return ResponseEntity
            .created(new URI("/api/liked-songs/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /liked-songs/:id} : Updates an existing likedSong.
     *
     * @param id the id of the likedSong to save.
     * @param likedSong the likedSong to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated likedSong,
     * or with status {@code 400 (Bad Request)} if the likedSong is not valid,
     * or with status {@code 500 (Internal Server Error)} if the likedSong couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/liked-songs/{id}")
    public ResponseEntity<LikedSong> updateLikedSong(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody LikedSong likedSong
    ) throws URISyntaxException {
        log.debug("REST request to update LikedSong : {}, {}", id, likedSong);
        if (likedSong.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, likedSong.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!likedSongRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        LikedSong result = likedSongRepository.save(likedSong);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, likedSong.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /liked-songs/:id} : Partial updates given fields of an existing likedSong, field will ignore if it is null
     *
     * @param id the id of the likedSong to save.
     * @param likedSong the likedSong to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated likedSong,
     * or with status {@code 400 (Bad Request)} if the likedSong is not valid,
     * or with status {@code 404 (Not Found)} if the likedSong is not found,
     * or with status {@code 500 (Internal Server Error)} if the likedSong couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/liked-songs/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<LikedSong> partialUpdateLikedSong(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody LikedSong likedSong
    ) throws URISyntaxException {
        log.debug("REST request to partial update LikedSong partially : {}, {}", id, likedSong);
        if (likedSong.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, likedSong.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!likedSongRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<LikedSong> result = likedSongRepository
            .findById(likedSong.getId())
            .map(existingLikedSong -> {
                if (likedSong.getChosen() != null) {
                    existingLikedSong.setChosen(likedSong.getChosen());
                }

                return existingLikedSong;
            })
            .map(likedSongRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, likedSong.getId().toString())
        );
    }

    /**
     * {@code GET  /liked-songs} : get all the likedSongs.
     *
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of likedSongs in body.
     */
    @GetMapping("/liked-songs")
    public List<LikedSong> getAllLikedSongs(@RequestParam(required = false) String filter) {
        if ("song-is-null".equals(filter)) {
            log.debug("REST request to get all LikedSongs where song is null");
            return StreamSupport
                .stream(likedSongRepository.findAll().spliterator(), false)
                .filter(likedSong -> likedSong.getSong() == null)
                .collect(Collectors.toList());
        }
        log.debug("REST request to get all LikedSongs");
        return likedSongRepository.findAll();
    }

    /**
     * {@code GET  /liked-songs/:id} : get the "id" likedSong.
     *
     * @param id the id of the likedSong to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the likedSong, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/liked-songs/{id}")
    public ResponseEntity<LikedSong> getLikedSong(@PathVariable Long id) {
        log.debug("REST request to get LikedSong : {}", id);
        Optional<LikedSong> likedSong = likedSongRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(likedSong);
    }

    /**
     * {@code DELETE  /liked-songs/:id} : delete the "id" likedSong.
     *
     * @param id the id of the likedSong to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/liked-songs/{id}")
    public ResponseEntity<Void> deleteLikedSong(@PathVariable Long id) {
        log.debug("REST request to delete LikedSong : {}", id);
        likedSongRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
