<template>
  <div>
    <h2>Track Title?</h2>
    <div class="quiz">
      <div class="quiz-choices">
        <div v-for="(track, idx) in question.tracks" :key="idx"
          class="quiz-choice" @click="onAnswerSelect(idx)">
          <img :src="track.album.images[0].url" alt="track.name" 
            class="quiz-choice--album-cover">
          <span class="quiz-choice--info">
            <p class="quiz-choice--text-name">{{ track.name }}</p>
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
.quiz {
  border-radius: 0.25rem;
  background-color: rgba(222, 222, 222, 0.33);
  padding: 5%;
  .quiz-choices {
    display: grid;
    grid-template-rows: 1fr 1fr;
    grid-template-columns: 1fr 1fr;
    grid-gap: 1rem 1rem;
    .quiz-choice {
      position: relative;
      img.quiz-choice--album-cover {
        width: 100%;
        height: 100%;
        opacity: 0.8;
        transition: box-shadow 0.1s ease-in;
        &:hover {
          box-shadow: 2px 2px 2px 2px black;
        }
      }
      .quiz-choice--info {
        position: absolute;
        top: 25%;
        left: 0;
        width: 100%;
        max-width: 100%;
        max-height: 100%;
        padding: 0.5rem 1rem;
        // background
        background: rgba(0, 0, 0, 0.66);
        // text styles
        text-align: center;
        color: lightgrey;
        p {
          margin: 0.5rem 0;
          user-select: none;
        }
        .quiz-choice--text-name {
          color: white;
          font-weight: bold;
          font-size: 1.3rem;
        }
        .quiz-choice--text-artist {
          font-style: italic;
        }
      }
      &:hover {
        cursor: pointer;
      }
    }
  }
}
</style>
