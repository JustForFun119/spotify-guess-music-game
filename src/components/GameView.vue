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
      <div class="selected-playlist-info">
        <p>Now playing</p>
        <p class="selected-playlist--name">
          {{ selectedPlaylist.name }}
        </p>
        <p class="selected-playlist--owner">
          by {{ selectedPlaylist.owner.display_name || selectedPlaylist.owner.id }}
        </p>
      </div>

      <game-quiz v-if="canStartGame" :tracks="playlistTracks"/>
      
      <div class="player-controls">
        <play-pause-button/>
        <volume-slider/>
      </div>
    </div>
  </div>
</template>

<script>
import PlaylistPicker from "./PlaylistPicker.vue";
import GameQuiz from "./GameQuiz.vue";
import VolumeSlider from "./VolumeSlider.vue";
import PlayPauseButton from "./PlayPauseButton.vue";
import { fetchUserPlaylist, fetchPlaylistTracks } from "../services.js";

export default {
  name: "game-view",
  components: { PlaylistPicker, GameQuiz, VolumeSlider, PlayPauseButton },
  data() {
    return {
      playlists: null,
      selectedPlaylist: null,
      playlistTracks: null,
      canStartGame: false,
      isPlayerPaused: false
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
.game-container {
  .selected-playlist-info {
    text-align: end;
    color: lightgrey;
    p {
      margin: 0;
    }
    .selected-playlist--name {
      margin-top: 0.5rem;
      font-weight: bold;
      font-size: 1.4rem;
      color: white;
    }
    .selected-playlist--owner {
      margin-top: 0.25rem;
    }
  }
  .playlist-selection {
    & > p {
      font-size: 1.2rem;
    }
  }
  .player-controls {
    background-color: rgba(222, 222, 222, 0.33);
    margin-top: 2%;
    padding: 2% 0;
    // flex row
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    & > * {
      margin: 0 1rem;
    }
  }
}
</style>
