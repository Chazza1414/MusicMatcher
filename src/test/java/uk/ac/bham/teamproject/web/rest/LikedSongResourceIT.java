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
import uk.ac.bham.teamproject.domain.LikedSong;
import uk.ac.bham.teamproject.repository.LikedSongRepository;

/**
 * Integration tests for the {@link LikedSongResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class LikedSongResourceIT {

    private static final Boolean DEFAULT_CHOSEN = false;
    private static final Boolean UPDATED_CHOSEN = true;

    private static final String ENTITY_API_URL = "/api/liked-songs";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private LikedSongRepository likedSongRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restLikedSongMockMvc;

    private LikedSong likedSong;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static LikedSong createEntity(EntityManager em) {
        LikedSong likedSong = new LikedSong().chosen(DEFAULT_CHOSEN);
        return likedSong;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static LikedSong createUpdatedEntity(EntityManager em) {
        LikedSong likedSong = new LikedSong().chosen(UPDATED_CHOSEN);
        return likedSong;
    }

    @BeforeEach
    public void initTest() {
        likedSong = createEntity(em);
    }

    @Test
    @Transactional
    void createLikedSong() throws Exception {
        int databaseSizeBeforeCreate = likedSongRepository.findAll().size();
        // Create the LikedSong
        restLikedSongMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(likedSong)))
            .andExpect(status().isCreated());

        // Validate the LikedSong in the database
        List<LikedSong> likedSongList = likedSongRepository.findAll();
        assertThat(likedSongList).hasSize(databaseSizeBeforeCreate + 1);
        LikedSong testLikedSong = likedSongList.get(likedSongList.size() - 1);
        assertThat(testLikedSong.getChosen()).isEqualTo(DEFAULT_CHOSEN);
    }

    @Test
    @Transactional
    void createLikedSongWithExistingId() throws Exception {
        // Create the LikedSong with an existing ID
        likedSong.setId(1L);

        int databaseSizeBeforeCreate = likedSongRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restLikedSongMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(likedSong)))
            .andExpect(status().isBadRequest());

        // Validate the LikedSong in the database
        List<LikedSong> likedSongList = likedSongRepository.findAll();
        assertThat(likedSongList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkChosenIsRequired() throws Exception {
        int databaseSizeBeforeTest = likedSongRepository.findAll().size();
        // set the field null
        likedSong.setChosen(null);

        // Create the LikedSong, which fails.

        restLikedSongMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(likedSong)))
            .andExpect(status().isBadRequest());

        List<LikedSong> likedSongList = likedSongRepository.findAll();
        assertThat(likedSongList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllLikedSongs() throws Exception {
        // Initialize the database
        likedSongRepository.saveAndFlush(likedSong);

        // Get all the likedSongList
        restLikedSongMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(likedSong.getId().intValue())))
            .andExpect(jsonPath("$.[*].chosen").value(hasItem(DEFAULT_CHOSEN.booleanValue())));
    }

    @Test
    @Transactional
    void getLikedSong() throws Exception {
        // Initialize the database
        likedSongRepository.saveAndFlush(likedSong);

        // Get the likedSong
        restLikedSongMockMvc
            .perform(get(ENTITY_API_URL_ID, likedSong.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(likedSong.getId().intValue()))
            .andExpect(jsonPath("$.chosen").value(DEFAULT_CHOSEN.booleanValue()));
    }

    @Test
    @Transactional
    void getNonExistingLikedSong() throws Exception {
        // Get the likedSong
        restLikedSongMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingLikedSong() throws Exception {
        // Initialize the database
        likedSongRepository.saveAndFlush(likedSong);

        int databaseSizeBeforeUpdate = likedSongRepository.findAll().size();

        // Update the likedSong
        LikedSong updatedLikedSong = likedSongRepository.findById(likedSong.getId()).get();
        // Disconnect from session so that the updates on updatedLikedSong are not directly saved in db
        em.detach(updatedLikedSong);
        updatedLikedSong.chosen(UPDATED_CHOSEN);

        restLikedSongMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedLikedSong.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedLikedSong))
            )
            .andExpect(status().isOk());

        // Validate the LikedSong in the database
        List<LikedSong> likedSongList = likedSongRepository.findAll();
        assertThat(likedSongList).hasSize(databaseSizeBeforeUpdate);
        LikedSong testLikedSong = likedSongList.get(likedSongList.size() - 1);
        assertThat(testLikedSong.getChosen()).isEqualTo(UPDATED_CHOSEN);
    }

    @Test
    @Transactional
    void putNonExistingLikedSong() throws Exception {
        int databaseSizeBeforeUpdate = likedSongRepository.findAll().size();
        likedSong.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLikedSongMockMvc
            .perform(
                put(ENTITY_API_URL_ID, likedSong.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(likedSong))
            )
            .andExpect(status().isBadRequest());

        // Validate the LikedSong in the database
        List<LikedSong> likedSongList = likedSongRepository.findAll();
        assertThat(likedSongList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchLikedSong() throws Exception {
        int databaseSizeBeforeUpdate = likedSongRepository.findAll().size();
        likedSong.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLikedSongMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(likedSong))
            )
            .andExpect(status().isBadRequest());

        // Validate the LikedSong in the database
        List<LikedSong> likedSongList = likedSongRepository.findAll();
        assertThat(likedSongList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamLikedSong() throws Exception {
        int databaseSizeBeforeUpdate = likedSongRepository.findAll().size();
        likedSong.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLikedSongMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(likedSong)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the LikedSong in the database
        List<LikedSong> likedSongList = likedSongRepository.findAll();
        assertThat(likedSongList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateLikedSongWithPatch() throws Exception {
        // Initialize the database
        likedSongRepository.saveAndFlush(likedSong);

        int databaseSizeBeforeUpdate = likedSongRepository.findAll().size();

        // Update the likedSong using partial update
        LikedSong partialUpdatedLikedSong = new LikedSong();
        partialUpdatedLikedSong.setId(likedSong.getId());

        partialUpdatedLikedSong.chosen(UPDATED_CHOSEN);

        restLikedSongMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLikedSong.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLikedSong))
            )
            .andExpect(status().isOk());

        // Validate the LikedSong in the database
        List<LikedSong> likedSongList = likedSongRepository.findAll();
        assertThat(likedSongList).hasSize(databaseSizeBeforeUpdate);
        LikedSong testLikedSong = likedSongList.get(likedSongList.size() - 1);
        assertThat(testLikedSong.getChosen()).isEqualTo(UPDATED_CHOSEN);
    }

    @Test
    @Transactional
    void fullUpdateLikedSongWithPatch() throws Exception {
        // Initialize the database
        likedSongRepository.saveAndFlush(likedSong);

        int databaseSizeBeforeUpdate = likedSongRepository.findAll().size();

        // Update the likedSong using partial update
        LikedSong partialUpdatedLikedSong = new LikedSong();
        partialUpdatedLikedSong.setId(likedSong.getId());

        partialUpdatedLikedSong.chosen(UPDATED_CHOSEN);

        restLikedSongMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLikedSong.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLikedSong))
            )
            .andExpect(status().isOk());

        // Validate the LikedSong in the database
        List<LikedSong> likedSongList = likedSongRepository.findAll();
        assertThat(likedSongList).hasSize(databaseSizeBeforeUpdate);
        LikedSong testLikedSong = likedSongList.get(likedSongList.size() - 1);
        assertThat(testLikedSong.getChosen()).isEqualTo(UPDATED_CHOSEN);
    }

    @Test
    @Transactional
    void patchNonExistingLikedSong() throws Exception {
        int databaseSizeBeforeUpdate = likedSongRepository.findAll().size();
        likedSong.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLikedSongMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, likedSong.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(likedSong))
            )
            .andExpect(status().isBadRequest());

        // Validate the LikedSong in the database
        List<LikedSong> likedSongList = likedSongRepository.findAll();
        assertThat(likedSongList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchLikedSong() throws Exception {
        int databaseSizeBeforeUpdate = likedSongRepository.findAll().size();
        likedSong.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLikedSongMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(likedSong))
            )
            .andExpect(status().isBadRequest());

        // Validate the LikedSong in the database
        List<LikedSong> likedSongList = likedSongRepository.findAll();
        assertThat(likedSongList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamLikedSong() throws Exception {
        int databaseSizeBeforeUpdate = likedSongRepository.findAll().size();
        likedSong.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLikedSongMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(likedSong))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the LikedSong in the database
        List<LikedSong> likedSongList = likedSongRepository.findAll();
        assertThat(likedSongList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteLikedSong() throws Exception {
        // Initialize the database
        likedSongRepository.saveAndFlush(likedSong);

        int databaseSizeBeforeDelete = likedSongRepository.findAll().size();

        // Delete the likedSong
        restLikedSongMockMvc
            .perform(delete(ENTITY_API_URL_ID, likedSong.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<LikedSong> likedSongList = likedSongRepository.findAll();
        assertThat(likedSongList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
