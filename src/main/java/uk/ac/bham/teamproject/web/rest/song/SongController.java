package uk.ac.bham.teamproject.web.rest.song;

import uk.ac.bham.teamproject.domain.entity.LikedSong;
import uk.ac.bham.teamproject.domain.entity.DislikedSong;
import uk.ac.bham.teamproject.repository.song.LikedSongRepository;
import uk.ac.bham.teamproject.repository.song.DislikedSongRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/songs")
public class SongController {

    @Autowired
    private LikedSongRepository likedSongRepository;

    @Autowired
    private DislikedSongRepository dislikedSongRepository;

    @PostMapping("/like")
    public LikedSong likeSong(@RequestBody LikedSong likedSong) {
        return likedSongRepository.save(likedSong);
    }

    @PostMapping("/dislike")
    public DislikedSong dislikeSong(@RequestBody DislikedSong dislikedSong) {
        if (dislikedSongRepository.count() >= 10) {
            DislikedSong oldestDislikedSong = dislikedSongRepository.findAll().get(0);
            dislikedSongRepository.deleteById(oldestDislikedSong.getId());
        }
        return dislikedSongRepository.save(dislikedSong);
    }
}
