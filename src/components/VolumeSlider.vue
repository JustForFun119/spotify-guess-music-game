<template>
  <div class="vol-slider-container">
    <i class="vol-icon material-icons" @click="toggleMute">{{ volumeIconName }}</i>
    <input type="range" min="0" max="100" step="1" class="volume-slider"
      v-model.number="volume" @input="onVolumeChange" @change="onVolumeChange"/>
  </div>
</template>

<script>
import { getPlayerVolume, setPlayerVolume } from "../services.js";

export default {
  name: "volume-slider",
  data() {
    return {
      volume: 10,
      volumeBeforeMute: 0.1,
      volumeIconName: "volume_up"
    };
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
      this.setVolume(volume);
      this.volumeBeforeMute = volume;
    },
    toggleMute() {
      getPlayerVolume().then(volume => {
        if (volume > 0) {
          // is not muted: mute
          this.setVolume(0);
          this.volume = 0; // update v-model value
        } else {
          // is muted: un-mute (with previous volume level)
          this.setVolume(this.volumeBeforeMute);
          this.volume = this.volumeBeforeMute * 100; // update v-model value
        }
      });
    },
    setVolume(volume) {
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
  i.vol-icon {
    user-select: none;
    cursor: pointer;
  }
  input[type="range"].volume-slider {
    margin: 0;
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
