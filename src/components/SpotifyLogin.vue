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
      console.log("user triggered spotify login");
      // https://accounts.spotify.com/authorize
    }
  }
};
</script>

<style>

</style>
