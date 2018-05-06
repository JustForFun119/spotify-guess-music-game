<template>
  <div class="playlist-list">
    <div v-for="(playlist, idx) in playlists" :key="idx"
      class="playlist-item" @click="$emit('onPlaylistSelect', playlist)">
      <div class="playlist-item--image">
        <img :src="getPlaylistImage(playlist)" :alt="playlist.name"/>
      </div>
      <div class="playlist-item--text">
        <p class="playlist-item--text-name">{{ playlist.name }}</p>
        <p class="playlist-item--text-owner">
          {{ playlist.owner.display_name || playlist.owner.id }}
        </p>
        <p>
          <span class="playlist-item--text-trackcount">
            {{ playlist.tracks.total }}
          </span> tracks
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "playlist-picker",
  props: { playlists: Array },
  methods: {
    getPlaylistImage(playlist) {
      if (playlist.images) {
        // use 2nd image (300px W/H); else 1st image
        const image =
          playlist.images.length > 1 ? playlist.images[1] : playlist.images[0];
        return image.url;
      }
      return null;
    }
  }
};
</script>

<style lang="scss">
.playlist-list {
  // playlist item flexbox
  display: flex;
  flex-direction: row;
  flex-flow: row wrap;
  justify-content: space-around;
  overflow-y: scroll; // scrolling
  & > .playlist-item {
    width: 40vw;
    margin: 1em 0;
    position: relative;
    @media (min-width: 425px) {
      width: 35vw;
      margin: 1em 0.5em;
    }
    div.playlist-item--image > img {
      width: 100%;
      margin-bottom: 0.5em;
      transition: opacity 0.1s ease-in-out;
      box-shadow: 2px 2px 8px -2px black;
      &:hover {
        opacity: 1;
        cursor: pointer;
      }
    }
    div.playlist-item--text {
      max-width: 100%;
      padding: 0.2em 0;
      // background
      background: rgba(0, 0, 0, 0.33);
      // text styles
      color: lightgrey;
      user-select: none;
      p {
        margin: 0.2em 0;
      }
      .playlist-item--text-name {
        color: white;
        font-weight: bold;
        @media (min-width: 425px) {
          font-size: 1.2em;
        }
      }
      .playlist-item--text-owner {
        font-style: italic;
        @media (min-width: 425px) {
          font-size: 1.1em;
        }
      }
      .playlist-item--text-trackcount {
        color: white;
        @media (min-width: 425px) {
          font-size: 1.1em;
        }
      }
    }
  }
}
</style>
