package uk.ac.bham.teamproject.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
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
import uk.ac.bham.teamproject.domain.MainPage;
import uk.ac.bham.teamproject.repository.MainPageRepository;
import uk.ac.bham.teamproject.web.rest.errors.BadRequestAlertException;

/**
 * REST controller for managing {@link uk.ac.bham.teamproject.domain.MainPage}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class MainPageResource {

    private final Logger log = LoggerFactory.getLogger(MainPageResource.class);

    private static final String ENTITY_NAME = "mainPage";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final MainPageRepository mainPageRepository;

    public MainPageResource(MainPageRepository mainPageRepository) {
        this.mainPageRepository = mainPageRepository;
    }

    /**
     * {@code POST  /main-pages} : Create a new mainPage.
     *
     * @param mainPage the mainPage to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new mainPage, or with status {@code 400 (Bad Request)} if the mainPage has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/main-pages")
    public ResponseEntity<MainPage> createMainPage(@Valid @RequestBody MainPage mainPage) throws URISyntaxException {
        log.debug("REST request to save MainPage : {}", mainPage);
        if (mainPage.getId() != null) {
            throw new BadRequestAlertException("A new mainPage cannot already have an ID", ENTITY_NAME, "idexists");
        }
        MainPage result = mainPageRepository.save(mainPage);
        return ResponseEntity
            .created(new URI("/api/main-pages/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /main-pages/:id} : Updates an existing mainPage.
     *
     * @param id the id of the mainPage to save.
     * @param mainPage the mainPage to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated mainPage,
     * or with status {@code 400 (Bad Request)} if the mainPage is not valid,
     * or with status {@code 500 (Internal Server Error)} if the mainPage couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/main-pages/{id}")
    public ResponseEntity<MainPage> updateMainPage(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody MainPage mainPage
    ) throws URISyntaxException {
        log.debug("REST request to update MainPage : {}, {}", id, mainPage);
        if (mainPage.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, mainPage.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!mainPageRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        MainPage result = mainPageRepository.save(mainPage);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, mainPage.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /main-pages/:id} : Partial updates given fields of an existing mainPage, field will ignore if it is null
     *
     * @param id the id of the mainPage to save.
     * @param mainPage the mainPage to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated mainPage,
     * or with status {@code 400 (Bad Request)} if the mainPage is not valid,
     * or with status {@code 404 (Not Found)} if the mainPage is not found,
     * or with status {@code 500 (Internal Server Error)} if the mainPage couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/main-pages/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<MainPage> partialUpdateMainPage(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody MainPage mainPage
    ) throws URISyntaxException {
        log.debug("REST request to partial update MainPage partially : {}, {}", id, mainPage);
        if (mainPage.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, mainPage.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!mainPageRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<MainPage> result = mainPageRepository
            .findById(mainPage.getId())
            .map(existingMainPage -> {
                return existingMainPage;
            })
            .map(mainPageRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, mainPage.getId().toString())
        );
    }

    /**
     * {@code GET  /main-pages} : get all the mainPages.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of mainPages in body.
     */
    @GetMapping("/main-pages")
    public List<MainPage> getAllMainPages() {
        log.debug("REST request to get all MainPages");
        return mainPageRepository.findAll();
    }

    /**
     * {@code GET  /main-pages/:id} : get the "id" mainPage.
     *
     * @param id the id of the mainPage to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the mainPage, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/main-pages/{id}")
    public ResponseEntity<MainPage> getMainPage(@PathVariable Long id) {
        log.debug("REST request to get MainPage : {}", id);
        Optional<MainPage> mainPage = mainPageRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(mainPage);
    }

    /**
     * {@code DELETE  /main-pages/:id} : delete the "id" mainPage.
     *
     * @param id the id of the mainPage to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/main-pages/{id}")
    public ResponseEntity<Void> deleteMainPage(@PathVariable Long id) {
        log.debug("REST request to delete MainPage : {}", id);
        mainPageRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
