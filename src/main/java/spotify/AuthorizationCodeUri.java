package spotify;

import java.net.URI;
import java.util.concurrent.CancellationException;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CompletionException;
import se.michaelthelin.spotify.SpotifyApi;
import se.michaelthelin.spotify.SpotifyHttpManager;
import se.michaelthelin.spotify.requests.authorization.authorization_code.AuthorizationCodeUriRequest;

public class AuthorizationCodeUri {

    private static final String clientId = "420af6bafdcf44398328b920c4c7dd97";
    private static final String clientSecret = "ca5438707e4149f2bbb229a876d06107";
    private static final URI redirectUri = SpotifyHttpManager.makeUri("http://localhost:9000/initial-training");

    private static final SpotifyApi spotifyApi = new SpotifyApi.Builder()
        .setClientId(clientId)
        .setClientSecret(clientSecret)
        .setRedirectUri(redirectUri)
        .build();
    private static final AuthorizationCodeUriRequest authorizationCodeUriRequest = spotifyApi
        .authorizationCodeUri()
        //          .state("x4xkmn9pu3j6ukrs8n")
        //          .scope("user-read-birthdate,user-read-email")
        //          .show_dialog(true)
        .build();

    public static void authorizationCodeUri_Sync() {
        final URI uri = authorizationCodeUriRequest.execute();

        System.out.println("URI: " + uri.toString());
        //return uri.toString();
    }

    public static String authorizationCodeUri_Async() {
        try {
            final CompletableFuture<URI> uriFuture = authorizationCodeUriRequest.executeAsync();

            // Thread free to do other tasks...

            // Example Only. Never block in production code.
            final URI uri = uriFuture.join();

            System.out.println("URI: " + uri.toString());
            return uri.toString();
        } catch (CompletionException e) {
            System.out.println("Error: " + e.getCause().getMessage());
        } catch (CancellationException e) {
            System.out.println("Async operation cancelled.");
        }
        return "failed";
    }

    public static void main(String[] args) {
        authorizationCodeUri_Sync();
        //return authorizationCodeUri_Async();
    }
}
