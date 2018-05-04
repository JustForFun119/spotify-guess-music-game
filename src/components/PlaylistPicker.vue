<template>
  <div class="playlist-list">
    <div v-for="(playlist, idx) in playlists" :key="idx"
      class="playlist-item" @click="$emit('onPlaylistSelect', playlist)">
      <p>{{ playlist.name }} by 
        {{ playlist.owner.display_name || playlist.owner.id }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "playlist-picker",
  props: { playlists: Array }
};
</script>

<style>
.playlist-list {
  display: flex;
  flex-direction: row;
  flex-flow: row wrap;
}
.playlist-item {
  border: 1px solid lightgrey;
  width: 50%;
}
</style>
