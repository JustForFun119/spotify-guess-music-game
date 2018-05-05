<template>
  <input type="range" min="0" max="100" step="1" class="volume-slider"
    v-model.number="volume" @input="onVolumeChange" @change="onVolumeChange"/>
</template>

<script>
import { getSpotifyWebPlayer } from "../services.js";

export default {
  name: "volume-slider",
  data() {
    return { volume: 0.1 };
  },
  mounted() {
    // init volume slider value from web player
    getSpotifyWebPlayer()
      .getVolume()
      .then(volume => {
        // player volume is over 100%
        // convert to 0-100 for range input
        this.volume = volume * 100;
      });
  },
  methods: {
    onVolumeChange(event) {
      const volume = event.target.valueAsNumber / 100;
      // set volume on web player
      getSpotifyWebPlayer().setVolume(volume);
    }
  }
};
</script>

<style lang="scss">
input[type="range"].volume-slider {
  -webkit-appearance: none;
  background: none;
  width: 25%;
  // track
  &::-webkit-slider-runnable-track {
    border-radius: 1rem;
    border: none;
    background-color: grey;
  }
  // thumb/handle
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    background-color: white;
  }
}
</style>
