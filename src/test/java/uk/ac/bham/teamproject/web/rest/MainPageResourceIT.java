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
import uk.ac.bham.teamproject.domain.MainPage;
import uk.ac.bham.teamproject.repository.MainPageRepository;

/**
 * Integration tests for the {@link MainPageResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class MainPageResourceIT {

    private static final String ENTITY_API_URL = "/api/main-pages";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private MainPageRepository mainPageRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restMainPageMockMvc;

    private MainPage mainPage;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static MainPage createEntity(EntityManager em) {
        MainPage mainPage = new MainPage();
        return mainPage;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static MainPage createUpdatedEntity(EntityManager em) {
        MainPage mainPage = new MainPage();
        return mainPage;
    }

    @BeforeEach
    public void initTest() {
        mainPage = createEntity(em);
    }

    @Test
    @Transactional
    void createMainPage() throws Exception {
        int databaseSizeBeforeCreate = mainPageRepository.findAll().size();
        // Create the MainPage
        restMainPageMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(mainPage)))
            .andExpect(status().isCreated());

        // Validate the MainPage in the database
        List<MainPage> mainPageList = mainPageRepository.findAll();
        assertThat(mainPageList).hasSize(databaseSizeBeforeCreate + 1);
        MainPage testMainPage = mainPageList.get(mainPageList.size() - 1);
    }

    @Test
    @Transactional
    void createMainPageWithExistingId() throws Exception {
        // Create the MainPage with an existing ID
        mainPage.setId(1L);

        int databaseSizeBeforeCreate = mainPageRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restMainPageMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(mainPage)))
            .andExpect(status().isBadRequest());

        // Validate the MainPage in the database
        List<MainPage> mainPageList = mainPageRepository.findAll();
        assertThat(mainPageList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllMainPages() throws Exception {
        // Initialize the database
        mainPageRepository.saveAndFlush(mainPage);

        // Get all the mainPageList
        restMainPageMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(mainPage.getId().intValue())));
    }

    @Test
    @Transactional
    void getMainPage() throws Exception {
        // Initialize the database
        mainPageRepository.saveAndFlush(mainPage);

        // Get the mainPage
        restMainPageMockMvc
            .perform(get(ENTITY_API_URL_ID, mainPage.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(mainPage.getId().intValue()));
    }

    @Test
    @Transactional
    void getNonExistingMainPage() throws Exception {
        // Get the mainPage
        restMainPageMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingMainPage() throws Exception {
        // Initialize the database
        mainPageRepository.saveAndFlush(mainPage);

        int databaseSizeBeforeUpdate = mainPageRepository.findAll().size();

        // Update the mainPage
        MainPage updatedMainPage = mainPageRepository.findById(mainPage.getId()).get();
        // Disconnect from session so that the updates on updatedMainPage are not directly saved in db
        em.detach(updatedMainPage);

        restMainPageMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedMainPage.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedMainPage))
            )
            .andExpect(status().isOk());

        // Validate the MainPage in the database
        List<MainPage> mainPageList = mainPageRepository.findAll();
        assertThat(mainPageList).hasSize(databaseSizeBeforeUpdate);
        MainPage testMainPage = mainPageList.get(mainPageList.size() - 1);
    }

    @Test
    @Transactional
    void putNonExistingMainPage() throws Exception {
        int databaseSizeBeforeUpdate = mainPageRepository.findAll().size();
        mainPage.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMainPageMockMvc
            .perform(
                put(ENTITY_API_URL_ID, mainPage.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(mainPage))
            )
            .andExpect(status().isBadRequest());

        // Validate the MainPage in the database
        List<MainPage> mainPageList = mainPageRepository.findAll();
        assertThat(mainPageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchMainPage() throws Exception {
        int databaseSizeBeforeUpdate = mainPageRepository.findAll().size();
        mainPage.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMainPageMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(mainPage))
            )
            .andExpect(status().isBadRequest());

        // Validate the MainPage in the database
        List<MainPage> mainPageList = mainPageRepository.findAll();
        assertThat(mainPageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamMainPage() throws Exception {
        int databaseSizeBeforeUpdate = mainPageRepository.findAll().size();
        mainPage.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMainPageMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(mainPage)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the MainPage in the database
        List<MainPage> mainPageList = mainPageRepository.findAll();
        assertThat(mainPageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateMainPageWithPatch() throws Exception {
        // Initialize the database
        mainPageRepository.saveAndFlush(mainPage);

        int databaseSizeBeforeUpdate = mainPageRepository.findAll().size();

        // Update the mainPage using partial update
        MainPage partialUpdatedMainPage = new MainPage();
        partialUpdatedMainPage.setId(mainPage.getId());

        restMainPageMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMainPage.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMainPage))
            )
            .andExpect(status().isOk());

        // Validate the MainPage in the database
        List<MainPage> mainPageList = mainPageRepository.findAll();
        assertThat(mainPageList).hasSize(databaseSizeBeforeUpdate);
        MainPage testMainPage = mainPageList.get(mainPageList.size() - 1);
    }

    @Test
    @Transactional
    void fullUpdateMainPageWithPatch() throws Exception {
        // Initialize the database
        mainPageRepository.saveAndFlush(mainPage);

        int databaseSizeBeforeUpdate = mainPageRepository.findAll().size();

        // Update the mainPage using partial update
        MainPage partialUpdatedMainPage = new MainPage();
        partialUpdatedMainPage.setId(mainPage.getId());

        restMainPageMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMainPage.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMainPage))
            )
            .andExpect(status().isOk());

        // Validate the MainPage in the database
        List<MainPage> mainPageList = mainPageRepository.findAll();
        assertThat(mainPageList).hasSize(databaseSizeBeforeUpdate);
        MainPage testMainPage = mainPageList.get(mainPageList.size() - 1);
    }

    @Test
    @Transactional
    void patchNonExistingMainPage() throws Exception {
        int databaseSizeBeforeUpdate = mainPageRepository.findAll().size();
        mainPage.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMainPageMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, mainPage.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(mainPage))
            )
            .andExpect(status().isBadRequest());

        // Validate the MainPage in the database
        List<MainPage> mainPageList = mainPageRepository.findAll();
        assertThat(mainPageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchMainPage() throws Exception {
        int databaseSizeBeforeUpdate = mainPageRepository.findAll().size();
        mainPage.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMainPageMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(mainPage))
            )
            .andExpect(status().isBadRequest());

        // Validate the MainPage in the database
        List<MainPage> mainPageList = mainPageRepository.findAll();
        assertThat(mainPageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamMainPage() throws Exception {
        int databaseSizeBeforeUpdate = mainPageRepository.findAll().size();
        mainPage.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMainPageMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(mainPage)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the MainPage in the database
        List<MainPage> mainPageList = mainPageRepository.findAll();
        assertThat(mainPageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteMainPage() throws Exception {
        // Initialize the database
        mainPageRepository.saveAndFlush(mainPage);

        int databaseSizeBeforeDelete = mainPageRepository.findAll().size();

        // Delete the mainPage
        restMainPageMockMvc
            .perform(delete(ENTITY_API_URL_ID, mainPage.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<MainPage> mainPageList = mainPageRepository.findAll();
        assertThat(mainPageList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
