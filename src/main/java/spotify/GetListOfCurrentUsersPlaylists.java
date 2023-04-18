package spotify;

import java.io.IOException;
import java.util.concurrent.CancellationException;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CompletionException;
import org.apache.hc.core5.http.ParseException;
import se.michaelthelin.spotify.SpotifyApi;
import se.michaelthelin.spotify.exceptions.SpotifyWebApiException;
import se.michaelthelin.spotify.model_objects.specification.Paging;
import se.michaelthelin.spotify.model_objects.specification.PlaylistSimplified;
import se.michaelthelin.spotify.requests.data.playlists.GetListOfCurrentUsersPlaylistsRequest;

public class GetListOfCurrentUsersPlaylists {

    private static String accessToken = "";
    private static final SpotifyApi spotifyApi = new SpotifyApi.Builder().setAccessToken(accessToken).build();
    private static final GetListOfCurrentUsersPlaylistsRequest getListOfCurrentUsersPlaylistsRequest = spotifyApi
        .getListOfCurrentUsersPlaylists()
        //          .limit(10)
        //          .offset(0)
        .build();

    public static Integer getListOfCurrentUsersPlaylists_Sync() {
        try {
            final Paging<PlaylistSimplified> playlistSimplifiedPaging = getListOfCurrentUsersPlaylistsRequest.execute();

            return playlistSimplifiedPaging.getTotal();
            //System.out.println("Total: " + playlistSimplifiedPaging.getTotal());
        } catch (IOException | SpotifyWebApiException | ParseException e) {
            System.out.println("Error: " + e.getMessage());
        }
        return null;
    }

    public static void getListOfCurrentUsersPlaylists_Async() {
        try {
            final CompletableFuture<Paging<PlaylistSimplified>> pagingFuture = getListOfCurrentUsersPlaylistsRequest.executeAsync();

            // Thread free to do other tasks...

            // Example Only. Never block in production code.
            final Paging<PlaylistSimplified> playlistSimplifiedPaging = pagingFuture.join();

            System.out.println("Total: " + playlistSimplifiedPaging.getTotal());
        } catch (CompletionException e) {
            System.out.println("Error: " + e.getCause().getMessage());
        } catch (CancellationException e) {
            System.out.println("Async operation cancelled.");
        }
    }

    public static Integer main(String token) {
        accessToken = token;

        return getListOfCurrentUsersPlaylists_Sync();
        //getListOfCurrentUsersPlaylists_Async();
    }
}
