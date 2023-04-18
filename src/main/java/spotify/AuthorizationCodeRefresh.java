package spotify;

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
    private static final String clientSecret = "ca5438707e4149f2bbb229a876d06107";
    private static final String refreshToken =
        "AQA4wPYGGJlh8ph6kQKp04Vg_Rbh0V1eXBGLrnbAOAR20x8LZoiOrB4ytHekVg1ljQTPbVGZ722Hn6kw-Up8PwHC5R53GFcialaTtCwHiMY2LHssfcxk4SUDvS3aFmt0pZnV7y6UAo-Vlnww7oAyRxkjrXkAX4LyQ-ppOzhMVxxPC6rvtIi3ww7I";

    private static final SpotifyApi spotifyApi = new SpotifyApi.Builder()
        .setClientId(clientId)
        .setClientSecret(clientSecret)
        .setRefreshToken(refreshToken)
        .build();
    private static final AuthorizationCodeRefreshRequest authorizationCodeRefreshRequest = spotifyApi.authorizationCodeRefresh().build();

    public static void authorizationCodeRefresh_Sync() {
        try {
            final AuthorizationCodeCredentials authorizationCodeCredentials = authorizationCodeRefreshRequest.execute();

            // Set access and refresh token for further "spotifyApi" object usage
            spotifyApi.setAccessToken(authorizationCodeCredentials.getAccessToken());

            System.out.println("Expires in: " + authorizationCodeCredentials.getExpiresIn());
            System.out.println(authorizationCodeCredentials.getAccessToken());
        } catch (IOException | SpotifyWebApiException | ParseException e) {
            System.out.println("Error: " + e.getMessage());
        }
    }

    public static void authorizationCodeRefresh_Async() {
        try {
            final CompletableFuture<AuthorizationCodeCredentials> authorizationCodeCredentialsFuture = authorizationCodeRefreshRequest.executeAsync();

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
        authorizationCodeRefresh_Sync();
        //authorizationCodeRefresh_Async();
    }
}
