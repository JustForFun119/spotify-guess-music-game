<template>
  <div>
    <div v-if="!selectedPlaylist" class="playlist-selection">
      <p>Choose a playlist to begin</p>
      <p>Your Playlists</p>
      <playlist-picker v-if="playlists" :playlists="playlists"
        @onPlaylistSelect="onPlaylistSelect"/>
      <p v-else>Loading...</p>
    </div>

    <div v-else class="game-container">
      <p>{{ selectedPlaylist.name }} by 
      {{ selectedPlaylist.owner.display_name || selectedPlaylist.owner.id }}</p>

      <game v-if="canStartGame"
        :tracks="playlistTracks" :spotifyWebPlayer="spotifyWebPlayer"/>
    </div>
  </div>
</template>

<script>
import PlaylistPicker from "./PlaylistPicker.vue";
import Game from "./Game.vue";
import { fetchUserPlaylist, fetchPlaylistTracks } from "../services.js";

export default {
  name: "game-view",
  props: { spotifyWebPlayer: Object },
  components: { PlaylistPicker, Game },
  data() {
    return {
      playlists: null,
      selectedPlaylist: null,
      playlistTracks: null,
      canStartGame: false
    };
  },
  mounted() {
    fetchUserPlaylist().then(playlists => {
      this.playlists = playlists;
      console.log(playlists);
    });
  },
  methods: {
    onPlaylistSelect(playlist) {
      this.selectedPlaylist = playlist;
      fetchPlaylistTracks(playlist.id).then(tracks => {
        this.playlistTracks = tracks;
        this.canStartGame = true;
      });
    }
  }
};
</script>

<style lang="scss">
.playlist-selection {
  & > p {
    font-size: 1.2rem;
  }
}
</style>
