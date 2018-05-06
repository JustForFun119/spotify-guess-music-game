<template>
  <div>
    <div class="quiz">
      <p class="quiz-question">What is this track?</p>
      <div class="quiz-choices">
        <div v-for="(track, idx) in question.tracks" :key="idx"
          class="quiz-choice" @click="onAnswerSelect(idx)">
          <img :src="track.album.images[0].url" alt="track.name" 
            class="quiz-choice--album-cover">
          <span class="quiz-choice--info">
            <span class="quiz-choice--text-name">{{ track.name }}</span>
            <span class="quiz-choice--text-artist">
              {{ track.artists | artistNames }}
            </span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { playTrackOnPlayer } from "../services.js";

export default {
  name: "game-quiz-view",
  props: { tracks: Array },
  data() {
    return {
      tracksPool: null,
      question: {
        tracks: null,
        answerIdx: null
      }
    };
  },
  mounted() {
    this.tracksPool = this.tracks.map(trackMeta => trackMeta.track);
    this.startGame();
  },
  methods: {
    startGame() {
      // Guess name of track from 4 random tracks
      this.nextQuestion();
    },
    nextQuestion() {
      // choose 4 random tracks
      const numQuestionTracks = 4;
      const questionTracks = [];
      for (let i = 0; i < numQuestionTracks; i++) {
        const trackIdx = randomIdxFrom(this.tracksPool);
        questionTracks.push(this.tracksPool.splice(trackIdx, 1)[0]);
      }
      this.question.tracks = questionTracks;
      // pick one from selected tracks as answer
      this.question.answerIdx = randomIdxFrom(this.question.tracks);
      // play answer track for user to guess
      this.playTrack(this.question.tracks[this.question.answerIdx]);

      function randomIdxFrom(array) {
        return Math.floor(Math.random() * array.length);
      }
    },
    playTrack(track) {
      playTrackOnPlayer(track.uri, this.spotifyWebPlayer).catch(error => {
        console.log(error);
      });
    },
    onAnswerSelect(trackIdx) {
      if (trackIdx === this.question.answerIdx) {
        // correct answer!
        this.nextQuestion();
      } else {
        // wrong answer
      }
    }
  },
  filters: {
    artistNames(artists) {
      return artists.map(artist => artist.name).join(", ");
    }
  }
};
</script>

<style lang="scss">
// screen sizes
// -- widths
$screen-width-sm: 320px;
$screen-width-md: 375px;
$screen-width-lg: 425px;
$screen-width-xl: 768px;
// -- heights
$screen-height-sm: 500px;
$screen-height-md: 580px;
$screen-height-lg: 700px;
$screen-height-xl: 768px;

.quiz {
  margin-top: 1em;
  text-align: center;
  .quiz-question {
    margin: 0.5em 0;
    // adapt question text to screen
    font-size: 1.2em;
    @media (min-height: $screen-height-sm) {
      font-size: 1.4em;
    }
    @media (min-height: $screen-height-lg) {
      margin: 1em 0;
      font-size: 1.6em;
    }
    @media (orientation: landscape) {
      font-size: 1.4em;
    }
  }
  .quiz-choices {
    max-width: 75vh;
    margin: auto;
    padding: 1em;
    border-radius: 0.25em;
    background-image: -webkit-linear-gradient(
      top,
      rgba(30, 215, 96, 0),
      #69b196
    );
    // grid layout
    display: grid;
    grid-template-rows: 1fr 1fr;
    grid-template-columns: 1fr 1fr;
    grid-gap: 1em 1em;
    // adapt grid layout to screen
    @media (max-width: $screen-width-sm) {
      max-width: 55vh;
      padding: 1em;
      grid-gap: 0.5em 0.5em;
    }
    @media (min-width: $screen-width-sm) {
      max-width: 55vh;
    }
    @media (min-width: $screen-width-lg) {
      max-width: 50vh;
    }
    // list layout if landscape orientation
    @media (orientation: landscape) and (max-height: $screen-height-md) {
      max-width: 90vw;
      padding: 0.5em;
      grid-template-rows: 1fr;
      grid-template-columns: 1fr 1fr 1fr 1fr;
    }
    .quiz-choice {
      position: relative;
      // box shadow on mouse hover
      transition: box-shadow 0.1s ease-in;
      &:hover {
        box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.5);
      }
      img.quiz-choice--album-cover {
        width: 100%;
        height: 100%;
        vertical-align: middle;
      }
      .quiz-choice--info {
        position: absolute;
        top: 16%;
        left: 0;
        width: 100%;
        max-height: 70%;
        padding: 0.25em;
        // background
        background: rgba(0, 0, 0, 0.6);
        // text styles
        text-align: center;
        color: lightgrey;
        // adapt quiz info to screen
        @media (max-width: $screen-width-sm), (min-width: $screen-width-lg) {
          top: 10%;
          max-height: 85%;
        }
        @media (max-height: $screen-height-md) {
          top: 0;
          max-height: 95%;
        }
        p {
          margin: 0.5em 0;
          user-select: none;
        }
        .quiz-choice--text-name {
          display: block;
          color: white;
          font-weight: bold;
          // text overflow
          overflow: hidden;
          text-overflow: ellipsis;
          // adapt font size to screen
          --name-small-font: 1em;
          font-size: var(--name-small-font);
          max-height: calc((var(--name-small-font) + 0.5em) * 3);
          @media (min-width: $screen-width-md) and (min-height: $screen-height-md) {
            --name-medium-font: 1.2em;
            font-size: var(--name-medium-font);
            max-height: calc((var(--name-medium-font) + 0.5em) * 3);
          }
          @media (min-width: $screen-width-lg) and (min-height: $screen-height-lg) {
            --name-large-font: 1.4em;
            font-size: var(--name-large-font);
            max-height: calc((var(--name-large-font) + 0.5em) * 3);
          }
        }
        .quiz-choice--text-artist {
          // adapt font size for screen width
          --artist-small-font: 0.9em;
          --artist-medium-font: 1em;
          --artist-large-font: 1.2em;
          font-size: var(--artist-small-font);
          max-height: calc((var(--artist-small-font) + 0.5em) * 2);
          @media (min-width: $screen-width-md) and (min-height: $screen-height-md) {
            font-size: var(--artist-medium-font);
            max-height: calc((var(--artist-medium-font) + 0.5em) * 2);
          }
          @media (min-width: $screen-width-lg) and (min-height: $screen-height-lg) {
            font-size: var(--artist-large-font);
            max-height: calc((var(--artist-large-font) + 0.5em) * 2);
          }
        }
        // large screen view (tablet & larger)
        @media (min-width: $screen-width-xl) {
          top: 5%;
          text-align: start;
          padding: 0.25em 1em;
        }
      }
      &:hover {
        cursor: pointer;
      }
    }
  }
}
</style>
