<!-- prettier-ignore -->
<template>
<div id="app">

<!-- Taking a lot of inspiration from https://github.com/trezp/flashcards-vue thanks :-)  -->

  <div class="flashcard-form">
    <div class="card-id" style="font-size:10px"><span v-if="currentCardId">ID: {{currentCardId}}</span></div>
    <label for="front">Question
      <input v-model.trim="newFront" type="text" id="front">
    </label>
    <br> <br>
    <label for="back">Answer
      <input v-on:keypress.enter="saveCard()" v-model.trim="newBack" type="text" id="back">
    </label>
    <br> <br>
    <button v-on:click="saveCard()">Save Card</button>
    <span class="error" v-show="error">Oops! Flashcards need a front and a back.</span>
  </div>
  <br> <br>
  <button @click.prevent='newSeed()'>Shuffle</button>


  <ul class="flashcard-list">
    <li v-for="(card, index) in shuffle(cards)" v-on:click="toggleCard(card)" :key="index">
      <transition name="flip">
        <p class="card" v-if="!card.flipped" key="front" v-bind:style="{backgroundColor:randomColor(index)}">
          <span v-katex:auto v-html="card.question"></span>
          <span class="edit-card" v-on:click.stop="editCard(card)">✏️</span>
        </p>
        <p class="card" v-else key="back" v-bind:style="{backgroundColor:randomColor(index)}">
          <span v-katex:auto v-html="card.answer"></span>
          <span class="delete-card" v-on:click="deleteCard(card)">X</span>
          <span class="edit-card" v-on:click.stop="editCard(card)">✏️</span>
        </p>
      </transition>
    </li>
  </ul>

</div>
</template>

<script>
import * as shuffleSeed from "shuffle-seed";

import { db } from "@/services/storage";

export default {
  name: "App",
  data() {
    return {
      cards: [],
      newFront: "",
      newBack: "",
      error: false,
      seed: Date.now(),
      currentCardId: "",
      colors: ["#51aae5", "#e65f51", "#a17de9", "#feca34", "#e46055"]
    };
  },
  mounted() {
    this.cards = db.read();
  },
  methods: {
    randomColor: function(i) {
      const colors = shuffleSeed.shuffle(this.colors, this.seed);
      return colors[i % this.colors.length];
    },
    shuffle: function(cards) {
      return cards;
    },
    newSeed: function() {
      this.seed = Date.now();
    },
    toggleCard: function(card) {
      card.flipped = !card.flipped;
    },
    deleteCard: function(card) {
      // delete card from data store
      db.delete(card.id);
      // reload the cards from the data store to update the view
      this.cards = db.read();
    },
    editCard: function(card) {
      this.currentCardId = card.id;
      this.newFront = card.question;
      this.newBack = card.answer;
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    },
    saveCard: function() {}
  }
};
</script>

<style>
/* Taking most of this CSS from https://github.com/trezp/flashcards-vue thanks :-) */

#app {
  font-family: "Montserrat", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  max-width: 100%;
  padding: 2em;
}

/* Flash cards */

.card {
  display: block;
  width: 150px;
  height: 175px;
  padding: 80px 50px;
  background-color: #51aae5;
  border-radius: 7px;
  margin: 5px;
  text-align: center;
  line-height: 27px;
  cursor: pointer;
  position: relative;
  color: #fff;
  font-weight: 600;
  font-size: 20px;
  -webkit-box-shadow: 9px 10px 22px -8px rgba(209, 193, 209, 0.5);
  -moz-box-shadow: 9px 10px 22px -8px rgba(209, 193, 209, 0.5);
  box-shadow: 9px 10px 22px -8px rgba(209, 193, 209, 0.5);
  will-change: transform;
}

ul {
  padding-left: 0;
  display: flex;
  flex-flow: row wrap;
}

li {
  list-style-type: none;
  padding: 10px 10px;
  transition: all 0.3s ease;
}

li:hover {
  transform: scale(1.1);
}

li:nth-child(-n + 3) .card {
  background-color: #e65f51;
}

li:nth-child(2n + 1) .card {
  background-color: #a17de9;
}

li:nth-child(4n) .card {
  background-color: #feca34;
}

li:nth-child(5n-2) .card {
  background-color: #51aae5;
}

li:nth-child(4n + 4) .card {
  background-color: #feca34;
}

li:nth-child(-7n + 7) .card {
  background-color: #e46055;
}

.delete-card {
  position: absolute;
  right: 0;
  top: 0;
  padding: 10px 15px;
  opacity: 0.4;
  transition: all 0.5s ease;
}

.card-id {
  margin-bottom: 20px;
  height: 10px;
}

.delete-card:hover,
.error {
  opacity: 1;
  transform: rotate(360deg);
}

.edit-card {
  position: absolute;
  left: 0;
  top: 0;
  padding: 10px 15px;
  opacity: 0.4;
  transition: all 0.5s ease;
}

.edit-card:hover,
.error {
  opacity: 1;
  transform: rotate(360deg);
}

.flip-enter-active {
  transition: all 0.4s ease;
}

.flip-leave-active {
  display: none;
}

.flip-enter,
.flip-leave {
  transform: rotateY(180deg);
  opacity: 0;
}

/* Form */

.flashcard-form {
  position: relative;
}

label {
  font-weight: 400;
  color: #333;
  margin-right: 10px;
}

input {
  border-radius: 5px;
  border: 2px solid #eaeaea;
  padding: 10px;
  outline: none;
}

button {
  border-radius: 5px;
  border: 1px solid #87cb84;
  background-color: #87cb84;
  padding: 8px 15px;
  outline: none;
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
}

button:hover {
  background-color: #70a66f;
}

.error {
  margin-top: 10px;
  display: block;
  color: #e44e42;
  font-weight: 600;
}
</style>
