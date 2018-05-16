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
    </div>

    <div v-show="canStartGame" class="playback">
      <playback-progress-bar class="playback--progress-bar"/>
      <div class="playback--controls">
        <play-pause-button class="playback-control"/>
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
import PlaybackProgressBar from "./PlaybackProgressBar.vue";
import { fetchUserPlaylist, fetchPlaylistTracks } from "../services.js";

export default {
  name: "game-view",
  components: {
    PlaylistPicker,
    GameQuiz,
    VolumeSlider,
    PlayPauseButton,
    PlaybackProgressBar
  },
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
        if (tracks) {
          this.playlistTracks = tracks;
          this.canStartGame = true;
        } else {
          // failed to obtain playlist tracks
          // TODO: retry?
        }
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
    flex: 8;
  }
}
.playback {
  position: sticky;
  bottom: 0;
  min-height: 14%;
  padding: 0 1em;
  // flexbox for progress bar and controls
  display: flex;
  flex-direction: column;
  // responsive
  @media (min-height: 580px) {
    min-height: 10%;
  }
  .playback--progress-bar {
    height: 1vh;
  }
  .playback--controls {
    flex: 1;
    padding: 0 1em;
    background-color: rgba(50, 50, 50, 0.5);
    // flex row
    display: grid;
    grid-template-columns: 2fr 1fr 2fr;
    grid-column-gap: 0.5em;
    justify-items: center;
    align-items: center;
    align-content: center;
    // TODO: better way of aligning controls?
    .playback-control {
      grid-column-start: 2;
    }
    .vol-control {
      width: 100%;
    }
  }
}
</style>
