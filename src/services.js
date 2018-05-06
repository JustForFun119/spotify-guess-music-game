// Spotify web API request builder
const getAPIRequestObj = () => ({
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
    }
});

// service state (local, in-memory)
let accessToken = null; // user auth access token
let spotifyWebPlayer = null, userID = null; // service state

export function processAuth(params) {
    // obtain access token from Spotify auth
    accessToken = params['access_token'];
    initSpotifyWebPlayer(); // init Spotify web player for music playback
    console.info('Acess token obtained', accessToken);
}
export function isUserLoggedIn() {
    return accessToken !== null;
}

// ---- Spotify web player
const DefaultPlayerVolume = 0.1;

function initSpotifyWebPlayer() {
    // Register Spotify Web Playback/Player
    window.onSpotifyWebPlaybackSDKReady = () => {
        const player = new Spotify.Player({
            name: "Guess the Music! Spotify Web Player",
            getOAuthToken: cb => {
                cb(accessToken);
            },
            volume: DefaultPlayerVolume
        });

        // Error handling
        player.addListener("initialization_error", ({ message }) => {
            console.error(message);
        });
        player.addListener("authentication_error", ({ message }) => {
            console.error(message);
        });
        player.addListener("account_error", ({ message }) => {
            console.error(message);
        });
        player.addListener("playback_error", ({ message }) => {
            console.error(message);
        });

        // Playback status updates
        player.addListener("player_state_changed", state => {
            console.log(state);
        });

        // Ready
        player.addListener("ready", ({ device_id }) => {
            console.log("Ready with Device ID", device_id);
        });

        // Not Ready
        player.addListener("not_ready", ({ device_id }) => {
            console.log("Device ID has gone offline", device_id);
        });

        // Connect to the player!
        player.connect();

        // player reference
        spotifyWebPlayer = player;
    };
}

export function getSpotifyWebPlayer() {
    return spotifyWebPlayer;
}

// Play a track with web player
export function playTrackOnPlayer(trackURI) {
    const playerID = spotifyWebPlayer._options.id;
    return new Promise((resolve, reject) => {
        if (!trackURI || !playerID) reject('invalid track URI/player ID');
        fetch(`https://api.spotify.com/v1/me/player/play?device_id=${playerID}`, {
            method: 'PUT',
            body: JSON.stringify({ uris: [trackURI] }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
        }).then(res => res.json()).then(resolve).catch(error => reject(error));
    });
}

// Fetch user's playlists from Spotify Web API
export function fetchUserPlaylist() {
    return new Promise((resolve, reject) => {
        // get user ID from '/me' API endpoint
        fetch('https://api.spotify.com/v1/me', getAPIRequestObj())
            .then(res => res.json())
            .then(resJson => {
                // user ID exist
                if (!resJson.id) reject('invalid user info');
                userID = resJson.id;
                // get user playlists from '/users/{ID}/playlists' API endpoint
                fetch(`https://api.spotify.com/v1/users/${userID}/playlists`,
                    getAPIRequestObj())
                    .then(res => res.json())
                    .then(playlistResJson => {
                        resolve(playlistResJson.items);
                    });
            });
    });
}

// Fetch tracks of playlist from Spotify Web API
export function fetchPlaylistTracks(playlistID) {
    return new Promise((resolve, reject) => {
        if (!userID || !playlistID) reject('invalid user ID/playlist ID');
        fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`,
            getAPIRequestObj())
            .then(res => res.json())
            .then(resJson => {
                resolve(resJson.items);
            });
    });
}