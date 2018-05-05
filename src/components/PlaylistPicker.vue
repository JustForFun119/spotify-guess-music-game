<template>
  <div class="playlist-list">
    <div v-for="(playlist, idx) in playlists" :key="idx"
      class="playlist-item" @click="$emit('onPlaylistSelect', playlist)">
      <img :src="getPlaylistImage(playlist)" :alt="playlist.name"
        class="playlist-item--cover"/>
      <span class="playlist-item--text">
        <p class="playlist-item--text-name">{{ playlist.name }}</p>
        by <span class="playlist-item--text-owner">
          {{ playlist.owner.display_name || playlist.owner.id }}
        </span>
        <p>
          <span class="playlist-item--text-trackcount">
            {{ playlist.tracks.total }}
          </span> tracks
        </p>
      </span>
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
  display: flex;
  flex-direction: row;
  flex-flow: row wrap;
  justify-content: space-between;
}
.playlist-item {
  width: 49%;
  margin: 1rem 0;
  position: relative;
  img.playlist-item--cover {
    width: 100%;
    height: 100%;
    opacity: 0.8;
    transition: opacity 0.1s ease-in-out;
    &:hover {
      opacity: 1;
      cursor: pointer;
    }
  }
  span.playlist-item--text {
    position: absolute;
    top: 16%;
    right: 0;
    max-width: 100%;
    // background
    background: rgba(0, 0, 0, 0.75);
    // text styles
    padding: 0.5rem 1rem;
    text-align: end;
    color: lightgrey;
    user-select: none;
    p {
      margin: 0.5rem 0;
    }
    .playlist-item--text-name {
      color: white;
      font-weight: bold;
      font-size: 1.3rem;
    }
    .playlist-item--text-owner {
      font-style: italic;
    }
    .playlist-item--text-trackcount {
      color: white;
    }
  }
}
</style>
