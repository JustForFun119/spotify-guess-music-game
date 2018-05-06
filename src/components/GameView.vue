<template>
  <div>
    <div v-if="!selectedPlaylist" class="playlist-selection">
      <p>Choose a playlist to begin:</p>
      <p class="playlist-selection--your-playlists">Your Playlists</p>
      <playlist-picker v-if="playlists" :playlists="playlists"
        @onPlaylistSelect="onPlaylistSelect"/>
      <p v-else>Loading...</p>
    </div>

    <div v-else class="game-container">
      <div class="selected-playlist-info">
        <span>Playlist: </span>
        <span class="selected-playlist--name">{{ selectedPlaylist.name }}</span>
        <span> by </span>
        <span class="selected-playlist--owner">{{ selectedPlaylist.owner.display_name || selectedPlaylist.owner.id }}</span>
      </div>

      <game-quiz v-if="canStartGame" :tracks="playlistTracks" class="game-quiz"/>
      
      <div class="player-controls">
        <play-pause-button/>
        <volume-slider class="vol-control"/>
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
.playlist-selection {
  // content flexbox
  height: 100%;
  display: flex;
  flex-direction: column;
  // other styles
  text-align: center;
  & > p {
    margin: 0.5em 0;
    &.playlist-selection--your-playlists {
      text-decoration: underline;
    }
    @media (min-width: 425px) {
      font-size: 1.2em;
    }
  }
}
.game-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  .selected-playlist-info {
    flex: 1;
    // element styles
    text-align: start;
    color: lightgrey;
    font-size: 1em;
    p {
      margin: 0;
    }
    .selected-playlist--name {
      margin-top: 0.5em;
      font-weight: bold;
      font-size: 1.1em;
      color: white;
    }
    .selected-playlist--owner {
      margin-top: 0.25em;
      font-style: italic;
    }
    @media (orientation: portrait) {
      // hide selected playlist info: space for quiz view
      @media (max-height: 520px) {
        display: none;
      }
    }
    @media (orientation: landscape) {
      // hide selected playlist info: space for quiz view
      @media (max-height: 480px) {
        display: none;
      }
    }
    @media (min-width: 720px) and (min-width: 768px) {
      flex: 0;
      font-size: 1.2em;
    }
  }
  .game-quiz {
    flex: 1;
  }
  .player-controls {
    min-height: 10%;
    margin-top: 5%;
    background-color: rgba(50, 50, 50, 0.5);
    // flex row
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    // responsive
    @media (orientation: landscape) {
      margin-top: 0;
    }
    & > * {
      margin: 0 1rem;
    }
    .vol-control {
      width: 33%;
    }
  }
}
</style>
