<template>
  <div id="app" class="container">
    <div class="header">
      <h1>Guess the Music!</h1>
      <h3>Powered by Spotify</h3>
    </div>
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { isUserLoggedIn } from "./services.js";

export default {
  name: "app",
  mounted() {
    // redirect to login page if not logged in
    if (isUserLoggedIn() === false) {
      this.$router.push("login");
    }
  }
};
</script>

<style lang="scss">
* {
  box-sizing: border-box;
}

// mobile screen sizing
html {
  height: 100%;
  width: 100%;
}
body {
  min-height: 100%;
  margin: 0;
  padding: 0;
  background-color: black;
  color: white;
}

// app styles
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  // theme
  padding-top: 5%;
  padding-left: 10%;
  padding-right: 10%;

  &.container {
    min-height: 100vh;
    margin: 0 auto;
  }
  .header {
    h1,
    h3 {
      margin: 0;
    }
  }
  .content {
    height: 100%;
    padding: 10% 0;
    text-align: center;
  }
}
</style>
