package uk.ac.bham.teamproject.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import uk.ac.bham.teamproject.web.rest.TestUtil;

class LikedSongTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(LikedSong.class);
        LikedSong likedSong1 = new LikedSong();
        likedSong1.setId(1L);
        LikedSong likedSong2 = new LikedSong();
        likedSong2.setId(likedSong1.getId());
        assertThat(likedSong1).isEqualTo(likedSong2);
        likedSong2.setId(2L);
        assertThat(likedSong1).isNotEqualTo(likedSong2);
        likedSong1.setId(null);
        assertThat(likedSong1).isNotEqualTo(likedSong2);
    }
}
