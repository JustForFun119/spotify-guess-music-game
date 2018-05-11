<template>
  <span class="btn-play-pause" @click="togglePlayPause">
    <i v-show="isPaused" class="material-icons">play_arrow</i>
    <i v-show="!isPaused" class="material-icons">pause</i>
  </span>
</template>

<script>
import { onPlayerStateChanged, togglePlayback } from "../services.js";

export default {
  name: "play-pause-button",
  data() {
    return { isPaused: false };
  },
  mounted() {
    // init player play/pause state listening
    onPlayerStateChanged(state => {
      if (state !== null) this.isPaused = state.paused;
    });
  },
  methods: {
    togglePlayPause() {
      // resume/pause local playback of player
      togglePlayback();
    }
  }
};
</script>

<style lang="scss">
.btn-play-pause {
  user-select: none;
  cursor: pointer;
  i.material-icons {
    vertical-align: middle;
    font-size: 36px;
    color: lightgrey;
    @media (hover: hover) {
      &:hover {
        color: white;
      }
    }
  }
}
</style>
