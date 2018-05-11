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
// service states
let spotifyWebPlayer = null; // web player reference
// user ID string, premium user flag (premium for web playback streaming)
let userID = null, isPremiumUser = false;
let trackPreviews = [];

export function processAuth(params) {
    // obtain access token from Spotify auth
    accessToken = params['access_token'];
    initSpotifyWebPlayer(); // init Spotify web player for music playback
}
export function isUserLoggedIn() {
    return accessToken !== null;
}

// Music player
const DefaultPlayerVolume = 0.1;
const localMusicPlayer = new Audio();
localMusicPlayer.volume = DefaultPlayerVolume;

// Spotify web playback/player
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
// web player (object) reference
export function getSpotifyWebPlayer() {
    return spotifyWebPlayer;
}
// player events
export function onPlayerStateChanged(listener) {
    if (isPremiumUser) { // web player
        spotifyWebPlayer.addListener("player_state_changed", listener);
    } else { // local playback
        const callback = e => {
            listener({ paused: localMusicPlayer.paused });
        };
        localMusicPlayer.addEventListener('play', callback);
        localMusicPlayer.addEventListener('pause', callback);
    }
}
// player controls
export function togglePlayback() {
    if (isPremiumUser) { // web player
        spotifyWebPlayer.togglePlay();
    } else { // local playback
        if (localMusicPlayer.paused) {
            localMusicPlayer.play();
        } else { // playing
            localMusicPlayer.pause();
        }
    }
}
export function pausePlayback() {
    if (isPremiumUser) { // web player
        spotifyWebPlayer.pause();
    } else { // local playback
        localMusicPlayer.pause();
    }
}
// volume controls
export function getPlayerVolume() {
    if (isPremiumUser) { // web player volume
        return spotifyWebPlayer.getVolume();
    } else { // local playback volume
        return new Promise((resolve, _) => {
            resolve(localMusicPlayer.volume);
        });
    }
}
export function setPlayerVolume(volume) {
    if (isPremiumUser) { // web player volume
        return spotifyWebPlayer.setVolume(volume);
    } else { // local playback volume
        localMusicPlayer.volume = volume;
        return new Promise((resolve, _) => {
            resolve(localMusicPlayer.volume);
        });
    }
}

// Play a track with web player
export function playTrack(trackURI) {
    if (isPremiumUser) {
        // premium user: play track on web player
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
    } else {
        // free user: play 30-second track preview instead
        const trackPreview = trackPreviews.find(trackMeta =>
            trackMeta['trackURI'] === trackURI);
        return new Promise((resolve, reject) => {
            if (trackPreview) {
                // play on local music player
                localMusicPlayer.src = trackPreview['previewURL'];
                localMusicPlayer.play();
                if (localMusicPlayer.paused) {
                    reject('cannot play track via local player');
                } else {
                    resolve('playing track');
                }
            } else {
                return new Promise((resolve, reject) => {
                    reject('no track preview');
                });
            }
        });
    }
}

// Fetch user's playlists from Spotify Web API
export function fetchUserPlaylist() {
    return new Promise((resolve, reject) => {
        // get user ID from '/me' API endpoint
        fetch('https://api.spotify.com/v1/me', getAPIRequestObj())
            .then(res => res.json())
            .then(resJson => {
                // user ID exist
                if (!resJson['id']) reject('invalid user info');
                // check if user is a premium user
                isPremiumUser = resJson['product'] === 'premium';
                userID = resJson['id'];
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
                if (isPremiumUser) {
                    // premium user: use fetched track meta as normal
                    resolve(resJson.items);
                } else {
                    // free user: use track preview URLs in fetched tracks
                    // filter tracks with available preview
                    const tracksWithPreview = resJson.items.filter(item =>
                        item['track']['preview_url'] !== null);
                    // store track preview URLs for playback
                    trackPreviews = tracksWithPreview.map(item =>
                        ({
                            trackURI: item['track']['uri'],
                            previewURL: item['track']['preview_url']
                        }));
                    resolve(tracksWithPreview);
                }
            });
    });
}