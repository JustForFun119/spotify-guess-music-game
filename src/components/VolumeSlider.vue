<template>
  <div class="vol-slider-container">
    <i class="material-icons">{{ volumeIconName }}</i>
    <input type="range" min="0" max="100" step="1" class="volume-slider"
      v-model.number="volume" @input="onVolumeChange" @change="onVolumeChange"/>
  </div>
</template>

<script>
import { getPlayerVolume, setPlayerVolume } from "../services.js";

export default {
  name: "volume-slider",
  data() {
    return { volume: 0.1, volumeIconName: "volume_up" };
  },
  mounted() {
    // init volume slider value from web player
    getPlayerVolume().then(volume => {
      // player volume is over 100%
      // convert to 0-100 for range input
      this.volume = volume * 100;
    });
  },
  methods: {
    onVolumeChange(event) {
      const volume = event.target.valueAsNumber / 100;
      // set volume on web player
      setPlayerVolume(volume);
      // set volume icon to volume level
      if (volume > 0.33) {
        this.volumeIconName = "volume_up";
      } else if (volume > 0) {
        this.volumeIconName = "volume_down";
      } else {
        this.volumeIconName = "volume_mute";
      }
    }
  }
};
</script>

<style lang="scss">
.vol-slider-container {
  & > * {
    vertical-align: middle;
  }
  input[type="range"].volume-slider {
    width: 60%;
    -webkit-appearance: none;
    background: none;
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
      background-color: lightgrey;
      @media (hover: hover) {
        &:hover {
          background-color: white;
        }
      }
    }
  }
}
</style>
