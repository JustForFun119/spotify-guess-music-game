<template>
  <div>
    <template v-if="!selectedPlaylist">
      <p>Choose a playlist to begin</p>
      <p>Your Playlists</p>
      <playlist-picker v-if="playlists" :playlists="playlists"
        @onPlaylistSelect="onPlaylistSelect"/>
      <p v-else>Loading...</p>
    </template>

    <template v-else>
      <p>{{ selectedPlaylist.name }} by 
      {{ selectedPlaylist.owner.display_name || selectedPlaylist.owner.id }}</p>

      <game :tracks="playlistTracks" :spotifyWebPlayer="spotifyWebPlayer"/>
    </template>
  </div>
</template>

<script>
import PlaylistPicker from "./PlaylistPicker.vue";
import Game from "./Game.vue";
import { fetchUserPlaylist, fetchPlaylistTracks } from "../services.js";

export default {
  name: "pre-game",
  props: { spotifyWebPlayer: Object },
  components: { PlaylistPicker, Game },
  data() {
    return {
      playlists: null,
      selectedPlaylist: null,
      playlistTracks: null
    };
  },
  mounted() {
    console.log("pre-game mounted");
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
      });
    }
  }
};
</script>

<style>

</style>
