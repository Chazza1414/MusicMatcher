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
import uk.ac.bham.teamproject.domain.DislikedSong;
import uk.ac.bham.teamproject.repository.DislikedSongRepository;
import uk.ac.bham.teamproject.web.rest.errors.BadRequestAlertException;

/**
 * REST controller for managing {@link uk.ac.bham.teamproject.domain.DislikedSong}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class DislikedSongResource {

    private final Logger log = LoggerFactory.getLogger(DislikedSongResource.class);

    private static final String ENTITY_NAME = "dislikedSong";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final DislikedSongRepository dislikedSongRepository;

    public DislikedSongResource(DislikedSongRepository dislikedSongRepository) {
        this.dislikedSongRepository = dislikedSongRepository;
    }

    /**
     * {@code POST  /disliked-songs} : Create a new dislikedSong.
     *
     * @param dislikedSong the dislikedSong to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new dislikedSong, or with status {@code 400 (Bad Request)} if the dislikedSong has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/disliked-songs")
    public ResponseEntity<DislikedSong> createDislikedSong(@Valid @RequestBody DislikedSong dislikedSong) throws URISyntaxException {
        log.debug("REST request to save DislikedSong : {}", dislikedSong);
        if (dislikedSong.getId() != null) {
            throw new BadRequestAlertException("A new dislikedSong cannot already have an ID", ENTITY_NAME, "idexists");
        }
        DislikedSong result = dislikedSongRepository.save(dislikedSong);
        return ResponseEntity
            .created(new URI("/api/disliked-songs/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /disliked-songs/:id} : Updates an existing dislikedSong.
     *
     * @param id the id of the dislikedSong to save.
     * @param dislikedSong the dislikedSong to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated dislikedSong,
     * or with status {@code 400 (Bad Request)} if the dislikedSong is not valid,
     * or with status {@code 500 (Internal Server Error)} if the dislikedSong couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/disliked-songs/{id}")
    public ResponseEntity<DislikedSong> updateDislikedSong(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody DislikedSong dislikedSong
    ) throws URISyntaxException {
        log.debug("REST request to update DislikedSong : {}, {}", id, dislikedSong);
        if (dislikedSong.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, dislikedSong.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!dislikedSongRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        DislikedSong result = dislikedSongRepository.save(dislikedSong);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, dislikedSong.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /disliked-songs/:id} : Partial updates given fields of an existing dislikedSong, field will ignore if it is null
     *
     * @param id the id of the dislikedSong to save.
     * @param dislikedSong the dislikedSong to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated dislikedSong,
     * or with status {@code 400 (Bad Request)} if the dislikedSong is not valid,
     * or with status {@code 404 (Not Found)} if the dislikedSong is not found,
     * or with status {@code 500 (Internal Server Error)} if the dislikedSong couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/disliked-songs/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<DislikedSong> partialUpdateDislikedSong(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody DislikedSong dislikedSong
    ) throws URISyntaxException {
        log.debug("REST request to partial update DislikedSong partially : {}, {}", id, dislikedSong);
        if (dislikedSong.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, dislikedSong.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!dislikedSongRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<DislikedSong> result = dislikedSongRepository
            .findById(dislikedSong.getId())
            .map(existingDislikedSong -> {
                if (dislikedSong.getChosen() != null) {
                    existingDislikedSong.setChosen(dislikedSong.getChosen());
                }

                return existingDislikedSong;
            })
            .map(dislikedSongRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, dislikedSong.getId().toString())
        );
    }

    /**
     * {@code GET  /disliked-songs} : get all the dislikedSongs.
     *
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of dislikedSongs in body.
     */
    @GetMapping("/disliked-songs")
    public List<DislikedSong> getAllDislikedSongs(@RequestParam(required = false) String filter) {
        if ("song-is-null".equals(filter)) {
            log.debug("REST request to get all DislikedSongs where song is null");
            return StreamSupport
                .stream(dislikedSongRepository.findAll().spliterator(), false)
                .filter(dislikedSong -> dislikedSong.getSong() == null)
                .collect(Collectors.toList());
        }
        log.debug("REST request to get all DislikedSongs");
        return dislikedSongRepository.findAll();
    }

    /**
     * {@code GET  /disliked-songs/:id} : get the "id" dislikedSong.
     *
     * @param id the id of the dislikedSong to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the dislikedSong, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/disliked-songs/{id}")
    public ResponseEntity<DislikedSong> getDislikedSong(@PathVariable Long id) {
        log.debug("REST request to get DislikedSong : {}", id);
        Optional<DislikedSong> dislikedSong = dislikedSongRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(dislikedSong);
    }

    /**
     * {@code DELETE  /disliked-songs/:id} : delete the "id" dislikedSong.
     *
     * @param id the id of the dislikedSong to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/disliked-songs/{id}")
    public ResponseEntity<Void> deleteDislikedSong(@PathVariable Long id) {
        log.debug("REST request to delete DislikedSong : {}", id);
        dislikedSongRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
