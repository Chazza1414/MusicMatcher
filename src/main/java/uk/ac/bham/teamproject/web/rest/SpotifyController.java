package uk.ac.bham.teamproject.web.rest;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/spotify")
@Transactional
public class SpotifyController {

    /*
    Endpoint for authenticating user for Spotify API
     */

    //get refresh token from

    //this returns the refresh token
    @GetMapping("/refreshtoken")
    public String getRefreshToken(@RequestParam("code") String code, @RequestParam("redirect_uri") String redirect_uri) {
        return AuthorizationCode.authorizationCode_Sync(code, redirect_uri);
    }

    //this returns the access token
    //    @GetMapping("/accesstoken")
    //    public String getMyResource(@RequestParam("refreshtoken") String refreshtoken) {
    //        //return ResponseEntity.ok(AuthorizationCode.main(authCode));
    //
    //        //gets access token given refresh token
    //        return AuthorizationCodeRefresh.authorizationCodeRefresh_Sync(refreshtoken);
    //        //return param1;
    //    }

    @GetMapping("/accesstoken")
    public String getAccessToken(@RequestParam("refreshtoken") String refreshtoken) {
        return AuthorizationCodeRefresh.authorizationCodeRefresh_Sync(refreshtoken);
    }
}
