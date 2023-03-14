package uk.ac.bham.teamproject.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import uk.ac.bham.teamproject.web.rest.TestUtil;

class DislikedSongTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(DislikedSong.class);
        DislikedSong dislikedSong1 = new DislikedSong();
        dislikedSong1.setId(1L);
        DislikedSong dislikedSong2 = new DislikedSong();
        dislikedSong2.setId(dislikedSong1.getId());
        assertThat(dislikedSong1).isEqualTo(dislikedSong2);
        dislikedSong2.setId(2L);
        assertThat(dislikedSong1).isNotEqualTo(dislikedSong2);
        dislikedSong1.setId(null);
        assertThat(dislikedSong1).isNotEqualTo(dislikedSong2);
    }
}
