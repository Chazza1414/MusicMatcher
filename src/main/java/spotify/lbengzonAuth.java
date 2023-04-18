package spotify;

import com.wrapper.spotify.Api;

public class lbengzonAuth {

    Api api = Api.builder().clientId("<your_client_id>").clientSecret("<your_client_secret>").redirectURI("<your_redirect_uri>").build();
}
