const accessToken = 'BQAuJ5DRH3YP0FjD9arCpiJB_5Fh0wnWtHmHqOOsZa5G-vzlu_MwduoW3GEfx2JP506DWNoxKxSYzh2B01x37pmA7GZzM2uXJFDOAXhBIrPprvd453z68G74MQ66GcnVy3FfN_EG9s_iNrEu6qRrh9gF3NqgDl2iPg';

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
        }).then(res => res.json()).then(resolve).catch(error => reject(error));
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