package spotify;

import java.io.IOException;
import java.util.concurrent.CancellationException;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CompletionException;
import org.apache.hc.core5.http.ParseException;
import se.michaelthelin.spotify.SpotifyApi;
import se.michaelthelin.spotify.exceptions.SpotifyWebApiException;
import se.michaelthelin.spotify.model_objects.credentials.AuthorizationCodeCredentials;
import se.michaelthelin.spotify.requests.authorization.authorization_code.pkce.AuthorizationCodePKCERefreshRequest;

public class SpotifyAuth {

    private static final String clientId = "420af6bafdcf44398328b920c4c7dd97";
    private static final String refreshToken =
        "AQCU7ZE6r9C7-eeqC55kV1nWookdiBXar-G1nc4N73L8Zeep7Sb2HqOnfrdk4eVSPh8S8DdSOTSd2H6KN6FZx9PXAhGppIZc3qVtwdSmUowxl_Rv9j38hcgHwMfntZs9vzAjzGO5RoS6rOdifq-_DPhxd4SAUkvcFod7tvpxlIDhcB-2c3c8EF0k";
    private static final SpotifyApi spotifyApi = new SpotifyApi.Builder().setClientId(clientId).setRefreshToken(refreshToken).build();
    private static final AuthorizationCodePKCERefreshRequest authorizationCodePKCERefreshRequest = spotifyApi
        .authorizationCodePKCERefresh()
        .build();

    public static void authorizationCodeRefresh_Sync() {
        try {
            final AuthorizationCodeCredentials authorizationCodeCredentials = authorizationCodePKCERefreshRequest.execute();

            // Set access and refresh token for further "spotifyApi" object usage
            spotifyApi.setAccessToken(authorizationCodeCredentials.getAccessToken());
            spotifyApi.setRefreshToken(authorizationCodeCredentials.getRefreshToken());

            System.out.println("Expires in: " + authorizationCodeCredentials.getExpiresIn());
        } catch (IOException | SpotifyWebApiException | ParseException e) {
            System.out.println("Error: " + e.getMessage());
        }
    }

    public static void authorizationCodeRefresh_Async() {
        try {
            final CompletableFuture<AuthorizationCodeCredentials> authorizationCodeCredentialsFuture = authorizationCodePKCERefreshRequest.executeAsync();

            // Thread free to do other tasks...

            // Example Only. Never block in production code.
            final AuthorizationCodeCredentials authorizationCodeCredentials = authorizationCodeCredentialsFuture.join();

            // Set access token for further "spotifyApi" object usage
            spotifyApi.setAccessToken(authorizationCodeCredentials.getAccessToken());

            System.out.println("Expires in: " + authorizationCodeCredentials.getExpiresIn());
        } catch (CompletionException e) {
            System.out.println("Error: " + e.getCause().getMessage());
        } catch (CancellationException e) {
            System.out.println("Async operation cancelled.");
        }
    }

    public static void main(String[] args) {
        //authorizationCodeRefresh_Sync();
        //authorizationCodeRefresh_Async();
    }
}
