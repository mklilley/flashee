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
      <h2> Settings </h2>
        <div style="text-align:left">
            <h3>Online storage</h3>
            <label class="switch"> Toggle online storage
              <input type="checkbox" v-model="useRemoteStorage" @change="toggleRemoteStorage()">
              <span class="slider round"></span>
            </label><br><br>

      <div v-if="useRemoteStorage">
        <strong>Storage box ID:</strong><br>
    {{boxID}}  <button @click.prevent="copyToClipboard(boxID,$event)">copy</button><br><br>
    <strong>Storage box key:</strong><br>
{{apiKey}}  <button @click.prevent="copyToClipboard(apiKey,$event)">copy</button><br><br>
      <button @click.prevent='restoreData()'>Restore from current box</button><br><br>
      <button @click.prevent='showSwitchBoxModal()'>Switch to another box</button><br><br>
      Box status = {{boxStatus}} <br><br>
    </div>
      <button @click.prevent='showWelcome=true'>Show welcome screen</button><br><br>
  <h3>Your data</h3>
        <button @click.prevent='downloadData()'>Download your data</button><br><br>
        <button @click.prevent='showConfirmDelete=true'>Delete all your data</button><br><br>
        <button @click.prevent='showAddFomFileModal()'>Add data from file</button>
    </div>
    </div>
  </Modal>


  <!-- Card edit modal -->
  <Modal v-if="showModal" v-on:close="showModal = false">
    <div class="flashcard-form" slot="body">

      <div class="card-id" style="font-size:10px"><span v-if="currentCardId">ID: {{currentCardId}}</span></div>
        <input v-on:keypress.enter="saveCard()" v-model.trim="newFront" type="text" id="front" placeholder="Question">
        <span class="math" v-katex:auto v-on:click="toggleMath('newFront')"  v-bind:class='{mathActive:math.newFront}'>$$f(x)$$</span>
       <br> <br>
        <input v-on:keypress.enter="saveCard()" v-model.trim="newBack" type="text" id="back" placeholder="Answer"> <span class="math" v-katex:auto v-on:click="toggleMath('newBack')" v-bind:class='{mathActive:math.newBack}'> $$f(x)$$</span>
      <br> <br>
      <button v-on:click="saveCard()">Save Card</button>
      <span class="error" v-show="error">Oops! Flashcards need a front and a back.</span>
    </div>
  </Modal>


  <!-- Welcome modal -->
  <Modal v-if="showWelcome" v-on:close="showWelcome = false">
    <div slot="body" >
      <h1>Welcome to Flash</h1>
      <h2>The simple flash card app</h2>
      <div style="text-align:left">
      <h3>Local data storage</h3>
      Your flash cards are stored on your device using your browser's <a href="https://blog.logrocket.com/the-complete-guide-to-using-localstorage-in-javascript-apps-ba44edb53a36/." target="_blank">localStorage</a>.
      <h3>Online data storage</h3>
      <span v-if="useRemoteStorage">
      Your flash cards will also be backed up in an online storage "box" for free (you can turn this off in settings).<br><br>
      If you don't use the app for a year, however, your data will be deleted. <br><br>
      Here is your storage box ID:<br><br>
      <strong >{{boxID}}</strong>  <br><br>
      Here is your personal storage key:<br><br>
      <strong >{{apiKey}}</strong>  <br><br>
      <button @click.prevent="copyToClipboard('boxID: '+boxID+'\nstorageKey: '+apiKey, $event)">Copy your box ID and key</button> and keep them safe - anyone with your box ID can view your data and anyone with your key can edit and delete your data. <br><br>
    </span>
    <span v-else>
      Currently disabled in settings
    </span>
    </div>
    <br>
    <button @click.prevent='closeWelcome()'>OK</button>
    </div>
  </Modal>


  <!-- switchBox modal -->
  <Modal v-if="showSwitchBox" v-on:close="showSwitchBox = false">
    <div slot="body" >
      <h2>Switch box</h2>
       <input v-on:keypress.enter="switchBox()" v-model.trim="switchBoxID" type="text" placeholder="New box ID"><br><br>
       Use current storage key
       <input type="checkbox" v-model="usCurrentApiKey">
        <input v-if="!usCurrentApiKey" v-on:keypress.enter="switchBox()" v-model.trim="switchApiKey" type="text" placeholder="New storage key"><br><br>
      <button v-on:click="switchBox()">Switch to new box</button>
      <span class="error" v-show="error">{{switchBoxError}}</span>
    </div>
  </Modal>

  <!-- confirmDelete modal -->
  <Modal v-if="showConfirmDelete" v-on:close="showConfirmDelete = false">
    <div slot="body" >
      <h2>Delete all data</h2>
      <button v-on:click="deleteAllData();showConfirmDelete=false">Yes, delete everything</button> <br><br>
      <button v-on:click="showConfirmDelete=false">No, take me back</button>

    </div>
  </Modal>

  <!-- addFromFile modal -->
  <Modal v-if="showAddFromFile" v-on:close="showAddFromFile = false">
    <div slot="body" >
      <h2>Add data from file</h2>
      <input type="file" @change="readFile"><br><br>
      <span class="error" v-show="error">{{addFromFileError}}</span>
      <button v-show="fileOK" v-on:click="addDataFromFile(file);showAddFromFile=false">Add data</button>
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
          <span class="edit-card" v-on:click.stop="editCard(card)"><i class="gg-pen" ></i></span>
        </p>
        <p class="card" v-else key="back" v-bind:style="{backgroundColor:randomColor(index)}">
          <span v-katex:auto v-html="card.answer"></span>
          <span class="delete-card" v-on:click.stop="deleteCard(card)"><i class="gg-trash" ></i></span>
          <span class="edit-card" v-on:click.stop="editCard(card)"><i class="gg-pen" ></i></span>
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
      boxID: "",
      apiKey: "",
      boxStatus: true,
      cards: [],
      newFront: "",
      newBack: "",
      error: false,
      seed: Date.now(),
      currentCardId: "",
      colors: ["#51aae5", "#e65f51", "#a17de9", "#feca34", "#e46055"],
      showModal: false,
      showSettings: false,
      showWelcome: false,
      math: { newFront: false, newBack: false },
      useRemoteStorage: true,
      showSwitchBox: false,
      switchBoxID: "",
      showConfirmDelete: false,
      switchApiKey: "",
      switchBoxError: "",
      usCurrentApiKey: true,
      showAddFromFile: false,
      addFromFileError: "",
      fileOK: false
    };
  },
  components: {
    Modal
  },
  async mounted() {
    this.cards = await db.read();
    this.showWelcome = !localStorage.getItem("haveSeenWelcome");
    if (localStorage.useRemoteStorage === null) {
      localStorage.useRemoteStorage = true;
    }
    // need to JSON prase in order for true/false to be boolean rather than string
    this.useRemoteStorage = JSON.parse(localStorage.useRemoteStorage);
    this.boxStatus = await db.status();
    this.boxID = await db.id();
    this.apiKey = await db.apiKey();
  },
  methods: {
    addDataFromFile: async function(cards) {
      console.log(this.useRemoteStorage);
      let promCreate = [];
      let reads = this.cards[0] ? this.cards[0].reads : 0;
      for (let card of cards) {
        promCreate.push(
          db.create(
            {
              question: card.question,
              answer: card.answer,
              flipped: false,
              reads: reads
            },
            { remote: this.useRemoteStorage }
          )
        );
      }

      await Promise.all(promCreate);
      // Reload the cards from the data store to update the view
      this.cards = await db.read();
    },
    readFile: function(event) {
      this.fileOK = false;
      this.error = false;

      let file = event.target.files[0];

      if (file) {
        let reader = new FileReader();

        reader.readAsText(file);

        reader.onload = () => {
          try {
            this.file = JSON.parse(reader.result);
            this.fileOK = true;
          } catch (error) {
            this.error = true;
            this.fileOK = false;
            this.addFromFileError =
              'Error: File must contain a list of questions and answers in the form [{"question":"2x2", "answer":"4"},{...},...] ';
          }
        };

        reader.onerror = () => {
          this.error = true;
          this.fileOK = false;
          this.addFromFileError = reader.error;
        };
      }
    },
    showAddFomFileModal: function() {
      this.error = false;
      this.fileOK = false;
      this.showAddFromFile = true;
    },
    downloadData: function() {
      //  Adapted from https://ourcodeworld.com/articles/read/189/how-to-create-a-file-and-generate-a-download-with-javascript-in-the-browser-without-a-server

      var element = document.createElement("a");
      element.setAttribute(
        "href",
        "data:text/plain;charset=utf-8," +
          encodeURIComponent(JSON.stringify(this.cards))
      );
      element.setAttribute("download", "flash.json");

      element.style.display = "none";
      document.body.appendChild(element);

      element.click();

      document.body.removeChild(element);
    },
    deleteAllData: async function() {
      // We will be deleting all cards at once. For this we will need to
      //  to create an array of promises and wait for them all to resolve
      let promDelete = [];
      for (let card of this.cards) {
        promDelete.push(db.delete(card.id, { remote: this.useRemoteStorage }));
      }
      await Promise.all(promDelete);

      // Reload the now empty set of cards from the data store to update the view
      this.cards = await db.read();
    },
    showSwitchBoxModal: function() {
      this.error = false;
      this.usCurrentApiKey = true;
      this.switchBoxError = "";
      this.switchBoxID = "";
      this.showSwitchBox = true;
    },
    switchBox: async function() {
      this.error = false;
      // lowercase the data before trying to swtich
      this.switchBoxID = this.switchBoxID.toLowerCase();
      this.switchApiKey = this.switchApiKey.toLowerCase();

      let switchApiKey;
      if (this.usCurrentApiKey) {
        switchApiKey = this.apiKey;
      } else {
        switchApiKey = this.switchApiKey;
      }

      // Try to switch to new box. If the boxID isn't valid then we give user error message

      let switchedOK = await db
        .switch(this.switchBoxID, switchApiKey)
        .catch(error => {
          this.switchBoxError = error;
          this.error = true;
        });
      if (switchedOK) {
        // Switch went ok. Now update the boxID and apiKey, close modal and reset switchBoxID
        this.boxID = await db.id();
        this.apiKey = await db.apiKey();
        this.showSwitchBox = false;
        this.switchBoxID = "";
        this.switchApiKey = "";
        // After switching we need to restore the data from the remote source. This
        // can be done asynchronously so no need to add await
        this.restoreData();
      }
    },
    toggleRemoteStorage: function() {
      // if useRemoteStorage has been turned off, we need to remove any
      // cards from the remote storage, else we need to add the local cards
      // to the remote storage
      if (this.useRemoteStorage == false) {
        this.deleteRemoteCards(this.cards);
      } else {
        this.createRemoteCards(this.cards);
      }
      // persist useRemoteStorage in local storage
      localStorage.useRemoteStorage = this.useRemoteStorage;
    },
    copyToClipboard: function(text, event) {
      navigator.clipboard.writeText(text).then(
        () => {
          console.log("Async: Copying to clipboard was successful!");
          event.target.classList.toggle("copied");
          let copyTimer = setTimeout(() => {
            event.target.classList.toggle("copied");
            clearTimeout(copyTimer);
          }, 1000);
        },
        function(err) {
          console.error("Async: Could not copy text: ", err);
        }
      );
    },
    closeWelcome: function() {
      this.showWelcome = false;
      localStorage.setItem("haveSeenWelcome", true);
    },
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
    toggleMath: function(varName) {
      let data = this[varName].split("$$");
      switch (data.length) {
        case 1:
          this[varName] = "$$" + data[0] + "$$";
          this.math[varName] = true;
          break;
        case 3:
          this[varName] = data[1];
          this.math[varName] = false;
          break;
        default:
      }
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
      await db.delete(card.id, { remote: this.useRemoteStorage });
      this.cards = await db.read();
    },
    deleteRemoteCards: async function(cards) {
      // We will be deleting many remote cards at once and then recreating them locally.
      // For this we will need to create an array of promises and wait for them all
      // to resolve
      let promDelete = [];
      let promCreate = [];
      for (let card of cards) {
        promDelete.push(db.delete(card.id, { remote: true }));
        promCreate.push(
          db.create(
            {
              question: card.question,
              answer: card.answer,
              flipped: false,
              reads: card.reads
            },
            { remote: false }
          )
        );
      }
      await Promise.all(promDelete);
      await Promise.all(promCreate);

      // Reload the cards from the data store to update the view
      this.cards = await db.read();
    },
    createRemoteCards: async function(cards) {
      // We will be deleting many local cards at once and then recreating them
      // remotely. For this we will need to create an array of promises and wait for
      // them allto resolve
      let promDelete = [];
      let promCreate = [];
      for (let card of cards) {
        promDelete.push(db.delete(card.id, { remote: false }));
        promCreate.push(
          db.create(
            {
              question: card.question,
              answer: card.answer,
              flipped: false,
              reads: card.reads
            },
            { remote: true }
          )
        );
      }
      await Promise.all(promCreate);
      await Promise.all(promDelete);

      // Reload the cards from the data store to update the view
      this.cards = await db.read();
    },
    editCard: function(card) {
      // Populate the card form with the data from the card you want to edit
      this.newFront = card.question;
      this.newBack = card.answer;
      this.error = false;

      // Check if there is math in the text and if so then make sure the math option is active
      this.math.newFront = this.newFront.match(/^\$\$/) === null ? false : true;
      this.math.newBack = this.newBack.match(/^\$\$/) === null ? false : true;

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
      this.math = { newFront: false, newBack: false };
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
          await db.create(
            {
              question: this.newFront,
              answer: this.newBack,
              flipped: false,
              reads: this.cards[0] ? this.cards[0].reads : 0
            },
            { remote: this.useRemoteStorage }
          );
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
            { remote: this.useRemoteStorage }
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
button.copied::after {
  content: " 👍";
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

.gg-trash {
  box-sizing: border-box;
  position: relative;
  display: block;
  transform: scale(var(--ggs, 1));
  width: 10px;
  height: 12px;
  border: 2px solid transparent;
  box-shadow: 0 0 0 2px, inset -2px 0 0, inset 2px 0 0;
  border-bottom-left-radius: 1px;
  border-bottom-right-radius: 1px;
  margin-top: 4px;
}

.gg-trash::after,
.gg-trash::before {
  content: "";
  display: block;
  box-sizing: border-box;
  position: absolute;
}

.gg-trash::after {
  background: currentColor;
  border-radius: 3px;
  width: 16px;
  height: 2px;
  top: -4px;
  left: -5px;
}

.gg-trash::before {
  width: 10px;
  height: 4px;
  border: 2px solid;
  border-bottom: transparent;
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
  top: -7px;
  left: -2px;
}

.gg-pen {
  box-sizing: border-box;
  position: relative;
  display: block;
  transform: rotate(-45deg) scale(var(--ggs, 1));
  width: 14px;
  height: 4px;
  border-right: 2px solid transparent;
  box-shadow: 0 0 0 2px, inset -2px 0 0;
  border-top-right-radius: 1px;
  border-bottom-right-radius: 1px;
  margin-right: -2px;
}

.gg-pen::after,
.gg-pen::before {
  content: "";
  display: block;
  box-sizing: border-box;
  position: absolute;
}

.gg-pen::before {
  background: currentColor;
  border-left: 0;
  right: -6px;
  width: 3px;
  height: 4px;
  border-radius: 1px;
  top: 0;
}

.gg-pen::after {
  width: 8px;
  height: 7px;
  border-top: 4px solid transparent;
  border-bottom: 4px solid transparent;
  border-right: 7px solid;
  left: -11px;
  top: -2px;
}

.top-bar {
  display: flex;
  justify-content: space-around;
  height: 20px;
}

::-webkit-input-placeholder {
  /* Chrome/Opera/Safari */
  color: grey;
}
::-moz-placeholder {
  /* Firefox 19+ */
  color: grey;
}
:-ms-input-placeholder {
  /* IE 10+ */
  color: grey;
}
:-moz-placeholder {
  /* Firefox 18- */
  color: grey;
}

.math {
  position: absolute;
  right: 0;
  padding: 5px;
  color: #eaeaea;
}

.mathActive {
  color: #87cb84;
}
</style>
