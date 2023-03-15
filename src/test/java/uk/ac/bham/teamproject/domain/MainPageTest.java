package uk.ac.bham.teamproject.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import uk.ac.bham.teamproject.web.rest.TestUtil;

class MainPageTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(MainPage.class);
        MainPage mainPage1 = new MainPage();
        mainPage1.setId(1L);
        MainPage mainPage2 = new MainPage();
        mainPage2.setId(mainPage1.getId());
        assertThat(mainPage1).isEqualTo(mainPage2);
        mainPage2.setId(2L);
        assertThat(mainPage1).isNotEqualTo(mainPage2);
        mainPage1.setId(null);
        assertThat(mainPage1).isNotEqualTo(mainPage2);
    }
}
