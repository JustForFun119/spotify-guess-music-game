<template>
  <div id="app" class="container">
    <div class="header">
      <h1>Guess the Music!</h1>
      <h3>Powered by Spotify</h3>
    </div>
    <div class="content">
      <spotify-login v-if="userIsLoggedIn === false"/>
      <pre-game v-if="userIsLoggedIn" :spotifyWebPlayer="spotifyWebPlayer"/>
    </div>
  </div>
</template>

<script>
import SpotifyLogin from "./components/SpotifyLogin.vue";
import PreGame from "./components/PreGame.vue";

export default {
  name: "app",
  components: { SpotifyLogin, PreGame },
  data() {
    return {
      userIsLoggedIn: true,
      spotifyWebPlayer: null
    };
  },
  mounted() {
    // initialize Spotify web player
    this.initSpotifyWebPlayer();
  },
  methods: {
    initSpotifyWebPlayer() {
      const token =
        "BQBsQEXGAkCe8_yms-sWscWPJw91d6Z9cLROkBDxST2p3akSdX0XvmASttjbV9U6j4rbB69d60i5PNV3XQlQtFX1A1OyIROihIEPBE0-0h5-NNztmLFaDUBEoUbaJB5slbu9y3-dg4ZQ-aVu_U1P5nJNhGbnC3_GmEJJV-1wiQ";

      // Register Spotify Web Playback/Player
      window.onSpotifyWebPlaybackSDKReady = () => {
        const player = new Spotify.Player({
          name: "Guess the Music! Spotify Web Player",
          getOAuthToken: cb => {
            cb(token);
          },
          volume: 0.25
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

        // reference player in Vue data
        this.spotifyWebPlayer = player;
      };
    }
  }
};
</script>

<style lang="scss">
* {
  box-sizing: border-box;
}

// mobile screen sizing
html {
  height: 100%;
  width: 100%;
}
body {
  min-height: 100%;
  margin: 0;
  padding: 0;
  background-color: black;
  color: white;
}

// app styles
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  // theme
  padding-top: 5%;
  padding-left: 10%;
  padding-right: 10%;

  &.container {
    min-height: 100vh;
    margin: 0 auto;
  }
  .header {
    h1,
    h3 {
      margin: 0;
    }
  }
  .content {
    height: 100%;
    padding: 10% 0;
    text-align: center;
  }
}
</style>
