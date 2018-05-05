<template>
  <div class="login">
    <button @click="spotifyLogin">Login to Spotify</button>
  </div>
</template>

<script>
export default {
  name: "spotify-login",
  methods: {
    spotifyLogin() {
      const clientID = "f798f0cebd0f45419dc1135072d12534";
      const redirectURI = "http://localhost:8080/#/login";
      const scopes = [
        // web playback
        "streaming",
        "user-read-birthdate",
        "user-read-email",
        "user-read-private",
        "user-modify-playback-state",
        // playlist access
        "playlist-read-private",
        "playlist-read-collaborative"
      ];
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

<style>

</style>
