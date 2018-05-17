<template>
  <div class="login">
    <p>Play the game with your Spotify playlists</p>
    <button @click="spotifyLogin" class="login-button">Login with Spotify</button>
  </div>
</template>

<script>
export default {
  name: "spotify-login",
  methods: {
    spotifyLogin() {
      // Spotify app client ID
      const clientID = "f798f0cebd0f45419dc1135072d12534";
      // Spotify client auth scopes
      const scopes = [
        // web music playback
        "streaming",
        "user-read-birthdate",
        "user-read-email",
        "user-read-private",
        "user-modify-playback-state",
        // playlist access
        "playlist-read-private",
        "playlist-read-collaborative"
      ];
      // redirect to this (login) page after auth
      const redirectURI = window.location.href;
      // auth result will be caught by vue-router (see /main.js)
      // visit Spotify auth page for client login
      this.redirectTo(
        "https://accounts.spotify.com/authorize?response_type=token" +
          `&client_id=${clientID}` +
          `&redirect_uri=${encodeURIComponent(redirectURI)}` +
          `&scope=${encodeURIComponent(scopes.join(","))}`
      );
    },
    redirectTo(url) {
      window.location.href = url;
    }
  }
};
</script>

<style lang="scss">
div.login {
  text-align: center;
  font-size: 1.2em;
  button.login-button {
    margin: 1em;
    padding: 1em 1.2em;
    font-size: 1em;
    border: none;
    border-radius: 2em;
    border-width: 0;
    user-select: none;
    /* official Spotify branding color */
    background-color: #1db954;
    color: white;
    transition: background-color 0.1s;
    &:hover {
      background-color: #1ed760;
      cursor: pointer;
    }
    &:active {
      background-color: #1aa34a;
    }
  }
}
</style>
