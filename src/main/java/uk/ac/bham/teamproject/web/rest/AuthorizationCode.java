package uk.ac.bham.teamproject.web.rest;

import java.io.IOException;
import java.net.URI;
import java.util.concurrent.CancellationException;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CompletionException;
import java.util.logging.Logger;
import org.apache.hc.core5.http.ParseException;
import se.michaelthelin.spotify.SpotifyApi;
import se.michaelthelin.spotify.SpotifyHttpManager;
import se.michaelthelin.spotify.exceptions.SpotifyWebApiException;
import se.michaelthelin.spotify.model_objects.credentials.AuthorizationCodeCredentials;
import se.michaelthelin.spotify.requests.authorization.authorization_code.AuthorizationCodeRequest;

public class AuthorizationCode {

    private static final String clientId = "420af6bafdcf44398328b920c4c7dd97";
    private static final String clientSecret = "e54bd430c6a6428e8355dba28e1f7a9f";
    private static final URI redirectUri = SpotifyHttpManager.makeUri("http://localhost:9000/initial-training");
    private static String code = "";

    public static String authorizationCode_Sync(String authCode) {
        try {
            SpotifyApi spotifyApi = new SpotifyApi.Builder()
                .setClientId(clientId)
                .setClientSecret(clientSecret)
                .setRedirectUri(redirectUri)
                .build();
            AuthorizationCodeRequest authorizationCodeRequest = spotifyApi.authorizationCode(authCode).build();

            final AuthorizationCodeCredentials authorizationCodeCredentials = authorizationCodeRequest.execute();

            // Set access and refresh token for further "spotifyApi" object usage
            spotifyApi.setAccessToken(authorizationCodeCredentials.getAccessToken());
            spotifyApi.setRefreshToken(authorizationCodeCredentials.getRefreshToken());

            System.out.println("Expires in: " + authorizationCodeCredentials.getExpiresIn());
            System.out.println("Access token: " + authorizationCodeCredentials.getAccessToken());
            return authorizationCodeCredentials.getAccessToken();
        } catch (IOException | SpotifyWebApiException | ParseException e) {
            return "Error: " + e.getMessage();
        }
    }
    //    public static void authorizationCode_Async() {
    //        try {
    //            final CompletableFuture<AuthorizationCodeCredentials> authorizationCodeCredentialsFuture = authorizationCodeRequest.executeAsync();
    //
    //            // Thread free to do other tasks...
    //
    //            // Example Only. Never block in production code.
    //            final AuthorizationCodeCredentials authorizationCodeCredentials = authorizationCodeCredentialsFuture.join();
    //
    //            // Set access and refresh token for further "spotifyApi" object usage
    //            spotifyApi.setAccessToken(authorizationCodeCredentials.getAccessToken());
    //            spotifyApi.setRefreshToken(authorizationCodeCredentials.getRefreshToken());
    //
    //            System.out.println("Expires in: " + authorizationCodeCredentials.getExpiresIn());
    //        } catch (CompletionException e) {
    //            System.out.println("Error: " + e.getCause().getMessage());
    //        } catch (CancellationException e) {
    //            System.out.println("Async operation cancelled.");
    //        }
    //    }
}
