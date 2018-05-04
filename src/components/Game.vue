<template>
  <div>
    <p>Title?</p>
    <div>
      <div v-for="(track, idx) in tracksInfo" :key="idx">
        <p @click="playTrack(track)">{{ track.name }}</p>
      </div>
    </div>

    <spotify-web-player></spotify-web-player>
  </div>
</template>

<script>
import SpotifyWebPlayer from "./SpotifyWebPlayer.vue";
import { playTrackOnPlayer } from "../services.js";

export default {
  name: "game",
  props: { spotifyWebPlayer: Object, tracks: Array },
  components: { SpotifyWebPlayer },
  data() {
    return {};
  },
  mounted() {
    console.log("game mounted");
  },
  methods: {
    playTrack(track) {
      playTrackOnPlayer(track.uri, this.spotifyWebPlayer).catch(error => {
        console.log(error);
      });
    }
  },
  computed: {
    tracksInfo() {
      return this.tracks ? this.tracks.map(trackMeta => trackMeta.track) : null;
    }
  }
};
</script>

<style>

</style>
