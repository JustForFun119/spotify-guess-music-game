<template>
  <div id="app">
    <h1>Guess the Music!</h1>
    <h3>Powered by Spotify</h3>

    <spotify-login v-if="userIsLoggedIn === false"/>

    <pre-game v-if="userIsLoggedIn" :spotifyWebPlayer="spotifyWebPlayer"/>
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
        "BQAYxKBkMdgpLbfodVr2bUI-TH4rxsmmvUQ8Juk_SB3KxY5EKUE6DROSfsfuvlX2cBa6V0S-sfDgX-D_egTXEhetGhdFW2FSsZlBRRvdCfGhJKD2Ok_y4cZExB_wLOllFVWVk9GEZZ2cQ2PDZ4iqJ2ZHL7mNG2tDYAjdODQB1A";

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

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  // TODO: theme?
}

h1,
h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
