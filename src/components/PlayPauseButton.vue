<template>
  <span class="btn-play-pause" @click="togglePlayPause">
    <i v-show="isPaused" class="material-icons">play_arrow</i>
    <i v-show="!isPaused" class="material-icons">pause</i>
  </span>
</template>

<script>
import { getSpotifyWebPlayer } from "../services.js";

export default {
  name: "play-pause-button",
  data() {
    return { isPaused: false };
  },
  mounted() {
    // init player play/pause state listening
    getSpotifyWebPlayer().addListener("player_state_changed", state => {
      this.isPaused = state.paused;
    });
  },
  methods: {
    togglePlayPause() {
      // resume/pause local playback of player
      getSpotifyWebPlayer().togglePlay();
    }
  }
};
</script>

<style>
.btn-play-pause {
  user-select: none;
  cursor: pointer;
}
</style>
