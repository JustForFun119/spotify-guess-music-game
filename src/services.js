const accessToken = 'BQBqxyNK5BydXH_juEqjKxqmxD3_mJmz0af65-JNYC8ltsVz-0EFbHOotmq7-GwXClWSaAiDcUhkySF9tgOCTnxEGAoDvn3lc-pf2H5YuhPJxVmbWrANhX3PQJJ2CVl26vrbzWpfBWBmhTiWeSNbo884lOM6dElmCw';

const apiRequest = (token) => ({
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    }
});

// service state (local, in-memory)
let userID;

export function playTrackOnPlayer(trackURI, { _options: { id } }) {
    return new Promise((resolve, reject) => {
        if (!id || !trackURI) reject('invalid track URI/player ID');
        fetch(`https://api.spotify.com/v1/me/player/play?device_id=${id}`, {
            method: 'PUT',
            body: JSON.stringify({ uris: [trackURI] }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
        }).then(res => res.json()).then(res => {
            console.log('services.playTrack: ', res);
        }).catch(error => reject(error));
    });
}

// Fetch user's playlists from Spotify Web API
export function fetchUserPlaylist() {
    return new Promise((resolve, reject) => {
        // get user ID from '/me' API endpoint
        fetch('https://api.spotify.com/v1/me', apiRequest(accessToken))
            .then(res => res.json())
            .then(resJson => {
                // user ID exist
                if (!resJson.id) reject('invalid user info');
                userID = resJson.id;
                // get user playlists from '/users/{ID}/playlists' API endpoint
                fetch(`https://api.spotify.com/v1/users/${userID}/playlists`,
                    apiRequest(accessToken))
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
            apiRequest(accessToken))
            .then(res => res.json())
            .then(resJson => {
                resolve(resJson.items);
            });
    });
}