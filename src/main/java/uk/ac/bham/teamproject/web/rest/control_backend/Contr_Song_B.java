package uk.ac.bham.teamproject.web.rest.control_backend;

import uk.ac.bham.teamproject.domain.entity_backend.Song_B;
import uk.ac.bham.teamproject.domain.entity_backend.Song_Liked_B;
import uk.ac.bham.teamproject.domain.entity_backend.Song_Disliked_B;
import uk.ac.bham.teamproject.repository.repository_backend.Repo_Liked_B;
import uk.ac.bham.teamproject.repository.repository_backend.Repo_Disliked_B;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/songs")
public class Contr_Song_B {

    @Autowired
    private Repo_Liked_B likedSongRepository;

    @Autowired
    private Repo_Disliked_B dislikedSongRepository;

    @PostMapping("/like")
    public Song_Liked_B likeSong(@RequestBody Song_Liked_B likedSong) {
        return likedSongRepository.save(likedSong);
    }

    @PostMapping("/dislike")
    public Song_Disliked_B dislikeSong(@RequestBody Song_Disliked_B dislikedSong) {
        if (dislikedSongRepository.count() >= 10) {
            Song_Disliked_B oldestDislikedSong = dislikedSongRepository.findAll().get(0);
            dislikedSongRepository.deleteById(oldestDislikedSong.getId());
        }
        return dislikedSongRepository.save(dislikedSong);
    }
}