<template>
  <div id="app" class="container">
    <div class="header">
      <div class="header--nav">
        <i class="material-icons" @click="visitHomePage">home</i>
      </div>
      <div class="header--info">
        <span class="header-title">Guess the Music!</span>
        <span class="header-subtitle">Powered by <a href="https://www.spotify.com" target="_blank">
          <picture class="spotify-logo">
            <source media="(max-width: 424px)" srcset="./assets/Spotify_Icon_RGB_Green.png">
            <source media="(min-width: 425px)" srcset="./assets/Spotify_Logo_RGB_Green.png">
            <img src="./assets/Spotify_Logo_RGB_Green.png" alt="Spotify"/>
          </picture></a>
        </span>
      </div>
    </div>
    <hr>
    <router-view class="content"></router-view>
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
  },
  methods: {
    visitHomePage() {
      window.location.href = "/";
    }
  }
};
</script>

<style lang="scss">
// screen sizes
// -- widths
$screen-width-lg: 425px;
$screen-width-xl: 768px;
// -- heights
$screen-height-sm: 500px;
$screen-height-xl: 768px;

* {
  box-sizing: border-box;
  // custom font
  font-family: "Open Sans", "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
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
  background-image: -webkit-linear-gradient(top, #162c2c, #76bfab);
  color: white;
}

// app styles
#app {
  &.container {
    // fullscreen-height
    height: 100vh;
    margin: 0 auto;
    // let app content fill remaining space
    display: flex;
    flex-direction: column;
    // spacing
    padding: 1em;
    @media (min-width: $screen-width-lg) {
      padding: 1em 2em;
    }
    .header {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      @media (min-width: $screen-width-lg) and (min-height: $screen-height-sm),
        (orientation: landscape) {
        text-align: start;
        align-items: flex-end;
      }
      span {
        margin: 0;
      }
      .header--info {
        @media (min-width: $screen-width-lg) and (min-height: $screen-height-sm),
          (orientation: landscape) {
          order: 1;
        }
        picture.spotify-logo > img {
          min-width: 21px; // per Spotify icon branding guideline
          max-width: 2em;
          margin: 0.5em;
          vertical-align: middle;
          @media (min-width: $screen-width-lg) {
            min-width: 70px; // per Spotify icon branding guideline
            max-width: 7em;
          }
        }
        .header-title {
          font-weight: bold;
          @media (min-width: $screen-width-lg) and (min-height: $screen-height-sm),
            (orientation: landscape) {
            display: block;
            font-size: 1.5em;
          }
          @media (min-width: $screen-width-xl) and (min-width: $screen-height-xl) {
            font-size: 1.8em;
          }
        }
        .header-subtitle {
          &::before {
            content: " - ";
          }
          font-size: 0.8em;
          @media (min-width: $screen-width-lg) and (min-height: $screen-height-sm) {
            max-width: 1em;
            font-size: 1.3em;
            &::before {
              content: "";
            }
          }
          @media (min-width: $screen-width-xl) and (min-width: $screen-height-xl) {
            font-size: 1.6em;
          }
        }
      }
      .header--nav {
        & > i {
          user-select: none;
          cursor: pointer;
        }
        @media (min-width: $screen-width-lg) and (min-height: $screen-height-sm),
          (orientation: landscape) {
          order: 2;
          margin: 0 1em;
          & > i {
            font-size: 36px;
          }
        }
      }
    }
    hr {
      width: 100%;
      margin-top: 0;
      @media (min-width: $screen-width-xl) and (min-width: $screen-height-xl) {
        margin: 1em 0;
      }
    }
    .content {
      overflow-y: hidden;
      flex: 1;
    }
  }
}
</style>
