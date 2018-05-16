<template>
  <div>
    <div class="playback-progress" 
      :style="{ width: barWidthStyleValue }"></div>    
  </div>
</template>

<script>
import {
  onPlayerProgressUpdated,
  onPlayerDurationUpdated
} from "../services.js";

export default {
  name: "playback-progress-bar",
  data() {
    return { current_ms: 0, duration_ms: 0 };
  },
  computed: {
    barWidthStyleValue() {
      return `${this.current_ms / this.duration_ms * 100}%`;
    }
  },
  mounted() {
    onPlayerProgressUpdated(currentTimeMs => {
      this.current_ms = currentTimeMs;
    });
    onPlayerDurationUpdated(durationMs => {
      this.duration_ms = durationMs;
    });
  }
};
</script>

<style lang="scss">
div.playback-progress {
  height: 100%;
  max-width: 100%;
  background-color: greenyellow;
  // smoother progress bar update transition
  transition: width 0.25s linear;
}
</style>
