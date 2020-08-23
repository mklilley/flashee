<!-- prettier-ignore -->
<template>
<div id="app">

  <!-- Taking a lot of inspiration from https://github.com/trezp/flashcards-vue and
  https://vuejs.org/v2/examples/modal.html thanks :-)  -->

  <!-- icons from https://css.gg/ -->

  <div class="top-bar">

    <div @click.prevent='newSeed()'  v-if="cards.length!=0"><i class="gg-dice-6"></i></div>

    <div id="show-modal" v-on:click="createCard()" v-if="cards.length!=0"> <i class="gg-add"></i></div>

    <div v-on:click="showSettings = true" ><i class="gg-menu" ></i></div>

  </div>



  <!-- Settings modal -->
  <Modal v-if="showSettings" v-on:close="showSettings = false">
    <div slot="body">
      <label for="back">Json Box ID
        <input v-on:keypress.enter="restoreData()" v-model.trim="boxID" type="text" id="boxID">
      </label>
      <button @click.prevent='restoreData()'>Restore</button>
      Box status = {{boxStatus}}
    </div>
  </Modal>

  <Modal v-if="showModal" v-on:close="showModal = false">
    <div class="flashcard-form" slot="body">
      <div class="card-id" style="font-size:10px"><span v-if="currentCardId">ID: {{currentCardId}}</span></div>
      <label for="front">Question
        <input v-on:keypress.enter="saveCard()" v-model.trim="newFront" type="text" id="front">
      </label>
      <br> <br>
      <label for="back">Answer
        <input v-on:keypress.enter="saveCard()" v-model.trim="newBack" type="text" id="back">
      </label>
      <br> <br>
      <button v-on:click="saveCard()">Save Card</button>
      <span class="error" v-show="error">Oops! Flashcards need a front and a back.</span>
    </div>
  </Modal>





  <ul class="flashcard-list">

    <p v-if="cards.length==0" class="no-card" v-on:click.stop="createCard()">
      <span>No cards, tap to create one</span>
    </p>


    <li v-for="(card, index) in shuffle(cards)" v-on:click="toggleCard(card)" :key="index">
      <transition name="flip">
        <p class="card" v-if="!card.flipped" key="front" v-bind:style="{backgroundColor:randomColor(index)}">
          <span v-katex:auto v-html="card.question"></span>
          <span class="edit-card" v-on:click.stop="editCard(card)">✏️</span>
        </p>
        <p class="card" v-else key="back" v-bind:style="{backgroundColor:randomColor(index)}">
          <span v-katex:auto v-html="card.answer"></span>
          <span class="delete-card" v-on:click.stop="deleteCard(card)">X</span>
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

import Modal from "./components/Modal.vue";

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
      colors: ["#51aae5", "#e65f51", "#a17de9", "#feca34", "#e46055"],
      showModal: false,
      showSettings: false
    };
  },
  components: {
    Modal
  },
  async mounted() {
    this.cards = await db.read();
  },
  methods: {
    randomColor: function(i) {
      const colors = shuffleSeed.shuffle(this.colors, this.seed);
      return colors[i % this.colors.length];
    },
    shuffle: function(cards) {
      const shuffledDeck = shuffleSeed.shuffle(cards, this.seed);

      // After deck is shuffled, sort the array so that the least seen cards
      // come to the top of the list. This is to stop you from seeing the same
      // cards all the time
      shuffledDeck.sort(function(a, b) {
        return parseFloat(a.reads || 0) - parseFloat(b.reads || 0);
      });

      return shuffledDeck;
    },
    newSeed: function() {
      this.seed = Date.now();
    },
    toggleCard: async function(card) {
      // When the card is flipped back from answer to question, we treat the
      // card as being "read". We update the read value in the local data store
      if (card.flipped) {
        await db.update(card.id, {
          reads: card.reads + 1
        });
        // Reload the cards from the data store to update the view
        this.cards = await db.read();
        // Randomise the cards after one has been read. This means the user
        // doesn't have to scroll down to get new cards if they don't want to.
        this.newSeed();
      }
      card.flipped = !card.flipped;
    },
    deleteCard: async function(card) {
      // delete card from data store
      await db.delete(card.id);
      this.cards = await db.read();
    },
    editCard: function(card) {
      // Populate the card form with the data from the card you want to edit
      this.newFront = card.question;
      this.newBack = card.answer;
      this.error = false;

      // Display the card id above the card form just in case you want to go and
      // manually find the card in the data store
      this.currentCardId = card.id;

      this.showModal = true;
    },
    createCard: function() {
      this.newFront = "";
      this.newBack = "";
      this.currentCardId = "";
      this.showModal = true;
      this.error = false;
    },
    saveCard: async function() {
      // Make sure the card form doesn't have empty fields
      if (!this.newFront.length || !this.newBack.length) {
        this.error = true;
      }
      // No empty fields, we are good to go!
      else {
        // NEW CARD
        // If no currentCardId, then we are creating a new card
        if (this.currentCardId === "") {
          // Create a card in the data store usinf data from the form
          await db.create({
            question: this.newFront,
            answer: this.newBack,
            flipped: false,
            reads: this.cards[0] ? this.cards[0].reads : 0
          });
          // Reload the cards from the data store to update the view
          this.cards = await db.read();

          // close the card edit modal
          this.showModal = false;
        }
        // UPDATE CARD
        // If we have a currentCardId then we are updating an existing card
        else {
          // Update card with id = currentCardId data from the form data
          // note this will also update the data on the remote database as well
          // as the local one
          await db.update(
            this.currentCardId,
            { question: this.newFront, answer: this.newBack },
            { remote: true }
          );
          // Reload the cards from the data store to update the view
          this.cards = await db.read();

          // close the card edit modal
          this.showModal = false;
        }

        // After the card has been saved we reset the form
        this.newFront = "";
        this.newBack = "";
        this.currentCardId = "";
        this.error = false;
      }
    },
    restoreData: async function() {
      this.cards = await db.read({ remote: true });
    }
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

.no-card {
  display: block;
  width: 150px;
  height: 175px;
  padding: 80px 50px;
  background-color: #fff;
  border-color: grey;
  border-style: dashed;
  border-radius: 7px;
  margin: 5px;
  text-align: center;
  line-height: 27px;
  cursor: pointer;
  position: relative;
  color: grey;
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

.gg-add {
  --ggs: 1.5;
  box-sizing: border-box;
  position: relative;
  display: block;
  width: 22px;
  height: 22px;
  border: 2px solid;
  transform: scale(var(--ggs, 1));
  border-radius: 22px;
  color: #87cb84;
}
.gg-add::after,
.gg-add::before {
  content: "";
  display: block;
  box-sizing: border-box;
  position: absolute;
  width: 10px;
  height: 2px;
  background: currentColor;
  border-radius: 5px;
  top: 8px;
  left: 4px;
}
.gg-add::after {
  width: 2px;
  height: 10px;
  top: 4px;
  left: 8px;
}

.gg-dice-6 {
  --ggs: 1.5;
  display: block;
  transform: scale(var(--ggs, 1));
  position: relative;
  box-sizing: border-box;
  width: 22px;
  height: 22px;
  border: 2px solid;
  border-radius: 3px;
  color: #87cb84;
}
.gg-dice-6::before {
  content: "";
  display: block;
  box-sizing: border-box;
  background: currentColor;
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 4px;
  left: 2px;
  top: 2px;
  box-shadow: 0 5px 0, 0 10px 0, 10px 0 0, 10px 5px 0, 10px 10px 0;
}

.gg-menu {
  --ggs: 1.5;
  transform: scale(var(--ggs, 1));
  color: #87cb84;
}
.gg-menu,
.gg-menu::after,
.gg-menu::before {
  box-sizing: border-box;
  position: relative;
  display: block;
  width: 20px;
  height: 2px;
  border-radius: 3px;
  background: currentColor;
}
.gg-menu::after,
.gg-menu::before {
  content: "";
  position: absolute;
  top: 6px;
}
.gg-menu::after {
  top: 12px;
}

.top-bar {
  display: flex;
  justify-content: space-around;
  height: 20px;
}
}


</style>
