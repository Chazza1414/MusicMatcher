package uk.ac.bham.teamproject.web.rest;

import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import spotify.GetListOfCurrentUsersPlaylists;

@RestController
@RequestMapping("/api/spotify")
@Transactional
public class SpotifyController {

    @GetMapping("/auth")
    public String getMyResource(@RequestParam("testParam") String param1) {
        //return ResponseEntity.ok(AuthorizationCode.main(authCode));
        return AuthorizationCode.authorizationCode_Sync(param1);
        //return param1;
    }
}
