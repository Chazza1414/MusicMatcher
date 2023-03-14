package uk.ac.bham.teamproject.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import uk.ac.bham.teamproject.IntegrationTest;
import uk.ac.bham.teamproject.domain.DislikedSong;
import uk.ac.bham.teamproject.repository.DislikedSongRepository;

/**
 * Integration tests for the {@link DislikedSongResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class DislikedSongResourceIT {

    private static final Boolean DEFAULT_CHOSEN = false;
    private static final Boolean UPDATED_CHOSEN = true;

    private static final String ENTITY_API_URL = "/api/disliked-songs";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private DislikedSongRepository dislikedSongRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restDislikedSongMockMvc;

    private DislikedSong dislikedSong;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static DislikedSong createEntity(EntityManager em) {
        DislikedSong dislikedSong = new DislikedSong().chosen(DEFAULT_CHOSEN);
        return dislikedSong;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static DislikedSong createUpdatedEntity(EntityManager em) {
        DislikedSong dislikedSong = new DislikedSong().chosen(UPDATED_CHOSEN);
        return dislikedSong;
    }

    @BeforeEach
    public void initTest() {
        dislikedSong = createEntity(em);
    }

    @Test
    @Transactional
    void createDislikedSong() throws Exception {
        int databaseSizeBeforeCreate = dislikedSongRepository.findAll().size();
        // Create the DislikedSong
        restDislikedSongMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(dislikedSong)))
            .andExpect(status().isCreated());

        // Validate the DislikedSong in the database
        List<DislikedSong> dislikedSongList = dislikedSongRepository.findAll();
        assertThat(dislikedSongList).hasSize(databaseSizeBeforeCreate + 1);
        DislikedSong testDislikedSong = dislikedSongList.get(dislikedSongList.size() - 1);
        assertThat(testDislikedSong.getChosen()).isEqualTo(DEFAULT_CHOSEN);
    }

    @Test
    @Transactional
    void createDislikedSongWithExistingId() throws Exception {
        // Create the DislikedSong with an existing ID
        dislikedSong.setId(1L);

        int databaseSizeBeforeCreate = dislikedSongRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restDislikedSongMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(dislikedSong)))
            .andExpect(status().isBadRequest());

        // Validate the DislikedSong in the database
        List<DislikedSong> dislikedSongList = dislikedSongRepository.findAll();
        assertThat(dislikedSongList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkChosenIsRequired() throws Exception {
        int databaseSizeBeforeTest = dislikedSongRepository.findAll().size();
        // set the field null
        dislikedSong.setChosen(null);

        // Create the DislikedSong, which fails.

        restDislikedSongMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(dislikedSong)))
            .andExpect(status().isBadRequest());

        List<DislikedSong> dislikedSongList = dislikedSongRepository.findAll();
        assertThat(dislikedSongList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllDislikedSongs() throws Exception {
        // Initialize the database
        dislikedSongRepository.saveAndFlush(dislikedSong);

        // Get all the dislikedSongList
        restDislikedSongMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(dislikedSong.getId().intValue())))
            .andExpect(jsonPath("$.[*].chosen").value(hasItem(DEFAULT_CHOSEN.booleanValue())));
    }

    @Test
    @Transactional
    void getDislikedSong() throws Exception {
        // Initialize the database
        dislikedSongRepository.saveAndFlush(dislikedSong);

        // Get the dislikedSong
        restDislikedSongMockMvc
            .perform(get(ENTITY_API_URL_ID, dislikedSong.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(dislikedSong.getId().intValue()))
            .andExpect(jsonPath("$.chosen").value(DEFAULT_CHOSEN.booleanValue()));
    }

    @Test
    @Transactional
    void getNonExistingDislikedSong() throws Exception {
        // Get the dislikedSong
        restDislikedSongMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingDislikedSong() throws Exception {
        // Initialize the database
        dislikedSongRepository.saveAndFlush(dislikedSong);

        int databaseSizeBeforeUpdate = dislikedSongRepository.findAll().size();

        // Update the dislikedSong
        DislikedSong updatedDislikedSong = dislikedSongRepository.findById(dislikedSong.getId()).get();
        // Disconnect from session so that the updates on updatedDislikedSong are not directly saved in db
        em.detach(updatedDislikedSong);
        updatedDislikedSong.chosen(UPDATED_CHOSEN);

        restDislikedSongMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedDislikedSong.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedDislikedSong))
            )
            .andExpect(status().isOk());

        // Validate the DislikedSong in the database
        List<DislikedSong> dislikedSongList = dislikedSongRepository.findAll();
        assertThat(dislikedSongList).hasSize(databaseSizeBeforeUpdate);
        DislikedSong testDislikedSong = dislikedSongList.get(dislikedSongList.size() - 1);
        assertThat(testDislikedSong.getChosen()).isEqualTo(UPDATED_CHOSEN);
    }

    @Test
    @Transactional
    void putNonExistingDislikedSong() throws Exception {
        int databaseSizeBeforeUpdate = dislikedSongRepository.findAll().size();
        dislikedSong.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDislikedSongMockMvc
            .perform(
                put(ENTITY_API_URL_ID, dislikedSong.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(dislikedSong))
            )
            .andExpect(status().isBadRequest());

        // Validate the DislikedSong in the database
        List<DislikedSong> dislikedSongList = dislikedSongRepository.findAll();
        assertThat(dislikedSongList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchDislikedSong() throws Exception {
        int databaseSizeBeforeUpdate = dislikedSongRepository.findAll().size();
        dislikedSong.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDislikedSongMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(dislikedSong))
            )
            .andExpect(status().isBadRequest());

        // Validate the DislikedSong in the database
        List<DislikedSong> dislikedSongList = dislikedSongRepository.findAll();
        assertThat(dislikedSongList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamDislikedSong() throws Exception {
        int databaseSizeBeforeUpdate = dislikedSongRepository.findAll().size();
        dislikedSong.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDislikedSongMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(dislikedSong)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the DislikedSong in the database
        List<DislikedSong> dislikedSongList = dislikedSongRepository.findAll();
        assertThat(dislikedSongList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateDislikedSongWithPatch() throws Exception {
        // Initialize the database
        dislikedSongRepository.saveAndFlush(dislikedSong);

        int databaseSizeBeforeUpdate = dislikedSongRepository.findAll().size();

        // Update the dislikedSong using partial update
        DislikedSong partialUpdatedDislikedSong = new DislikedSong();
        partialUpdatedDislikedSong.setId(dislikedSong.getId());

        partialUpdatedDislikedSong.chosen(UPDATED_CHOSEN);

        restDislikedSongMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDislikedSong.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDislikedSong))
            )
            .andExpect(status().isOk());

        // Validate the DislikedSong in the database
        List<DislikedSong> dislikedSongList = dislikedSongRepository.findAll();
        assertThat(dislikedSongList).hasSize(databaseSizeBeforeUpdate);
        DislikedSong testDislikedSong = dislikedSongList.get(dislikedSongList.size() - 1);
        assertThat(testDislikedSong.getChosen()).isEqualTo(UPDATED_CHOSEN);
    }

    @Test
    @Transactional
    void fullUpdateDislikedSongWithPatch() throws Exception {
        // Initialize the database
        dislikedSongRepository.saveAndFlush(dislikedSong);

        int databaseSizeBeforeUpdate = dislikedSongRepository.findAll().size();

        // Update the dislikedSong using partial update
        DislikedSong partialUpdatedDislikedSong = new DislikedSong();
        partialUpdatedDislikedSong.setId(dislikedSong.getId());

        partialUpdatedDislikedSong.chosen(UPDATED_CHOSEN);

        restDislikedSongMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDislikedSong.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDislikedSong))
            )
            .andExpect(status().isOk());

        // Validate the DislikedSong in the database
        List<DislikedSong> dislikedSongList = dislikedSongRepository.findAll();
        assertThat(dislikedSongList).hasSize(databaseSizeBeforeUpdate);
        DislikedSong testDislikedSong = dislikedSongList.get(dislikedSongList.size() - 1);
        assertThat(testDislikedSong.getChosen()).isEqualTo(UPDATED_CHOSEN);
    }

    @Test
    @Transactional
    void patchNonExistingDislikedSong() throws Exception {
        int databaseSizeBeforeUpdate = dislikedSongRepository.findAll().size();
        dislikedSong.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDislikedSongMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, dislikedSong.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(dislikedSong))
            )
            .andExpect(status().isBadRequest());

        // Validate the DislikedSong in the database
        List<DislikedSong> dislikedSongList = dislikedSongRepository.findAll();
        assertThat(dislikedSongList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchDislikedSong() throws Exception {
        int databaseSizeBeforeUpdate = dislikedSongRepository.findAll().size();
        dislikedSong.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDislikedSongMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(dislikedSong))
            )
            .andExpect(status().isBadRequest());

        // Validate the DislikedSong in the database
        List<DislikedSong> dislikedSongList = dislikedSongRepository.findAll();
        assertThat(dislikedSongList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamDislikedSong() throws Exception {
        int databaseSizeBeforeUpdate = dislikedSongRepository.findAll().size();
        dislikedSong.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDislikedSongMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(dislikedSong))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the DislikedSong in the database
        List<DislikedSong> dislikedSongList = dislikedSongRepository.findAll();
        assertThat(dislikedSongList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteDislikedSong() throws Exception {
        // Initialize the database
        dislikedSongRepository.saveAndFlush(dislikedSong);

        int databaseSizeBeforeDelete = dislikedSongRepository.findAll().size();

        // Delete the dislikedSong
        restDislikedSongMockMvc
            .perform(delete(ENTITY_API_URL_ID, dislikedSong.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<DislikedSong> dislikedSongList = dislikedSongRepository.findAll();
        assertThat(dislikedSongList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
