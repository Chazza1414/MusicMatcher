package uk.ac.bham.teamproject.web.rest;

import java.io.IOException;
import java.util.concurrent.CancellationException;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CompletionException;
import org.apache.hc.core5.http.ParseException;
import se.michaelthelin.spotify.SpotifyApi;
import se.michaelthelin.spotify.exceptions.SpotifyWebApiException;
import se.michaelthelin.spotify.model_objects.credentials.AuthorizationCodeCredentials;
import se.michaelthelin.spotify.requests.authorization.authorization_code.AuthorizationCodeRefreshRequest;

public class AuthorizationCodeRefresh {

    private static final String clientId = "420af6bafdcf44398328b920c4c7dd97";
    private static final String clientSecret = "e54bd430c6a6428e8355dba28e1f7a9f";

    //private static String refreshToken = "";

    //returns access token
    public static String authorizationCodeRefresh_Sync(String token) {
        try {
            SpotifyApi spotifyApi = new SpotifyApi.Builder()
                .setClientId(clientId)
                .setClientSecret(clientSecret)
                .setRefreshToken(token)
                .build();

            AuthorizationCodeRefreshRequest authorizationCodeRefreshRequest = spotifyApi.authorizationCodeRefresh().build();

            final AuthorizationCodeCredentials authorizationCodeCredentials = authorizationCodeRefreshRequest.execute();

            // Set access and refresh token for further "spotifyApi" object usage
            spotifyApi.setAccessToken(authorizationCodeCredentials.getAccessToken());

            System.out.println("Expires in: " + authorizationCodeCredentials.getExpiresIn());
            System.out.println(authorizationCodeCredentials.getAccessToken());
            return authorizationCodeCredentials.getAccessToken();
        } catch (IOException | SpotifyWebApiException | ParseException e) {
            System.out.println("Error: " + e.getMessage());
            return "error here: " + e.getMessage();
        }
    }
    //    public static void authorizationCodeRefresh_Async() {
    //        try {
    //            final CompletableFuture<AuthorizationCodeCredentials> authorizationCodeCredentialsFuture = authorizationCodeRefreshRequest.executeAsync();
    //
    //            // Thread free to do other tasks...
    //
    //            // Example Only. Never block in production code.
    //            final AuthorizationCodeCredentials authorizationCodeCredentials = authorizationCodeCredentialsFuture.join();
    //
    //            // Set access token for further "spotifyApi" object usage
    //            spotifyApi.setAccessToken(authorizationCodeCredentials.getAccessToken());
    //
    //            System.out.println("Expires in: " + authorizationCodeCredentials.getExpiresIn());
    //        } catch (CompletionException e) {
    //            System.out.println("Error: " + e.getCause().getMessage());
    //        } catch (CancellationException e) {
    //            System.out.println("Async operation cancelled.");
    //        }
    //    }
}
