import { box as remote } from "@/services/jsonbox";

// function to create random id for each flash card - inspired by
// https://stackoverflow.com/questions/105034/how-to-create-guid-uuid
function id() {
  return "xxxxxxxxxxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// key to identify the collection of cards in the data store
const key = "cards";

const db = {
  create: async function(newCard) {
    let remoteWorking = await remote.status();
    if (remoteWorking === true) {
      let result = await remote.create(newCard);
      newCard.id = result["_id"];
    } else {
      let i = id();
      newCard.id = i;
      let remoteFails = JSON.parse(localStorage.getItem("remoteFails")) || {};
      remoteFails[i] = "create";
      localStorage.setItem("remoteFails", JSON.stringify(remoteFails));
    }

    // Get all the cards
    let allCards = JSON.parse(localStorage.getItem(key)) || {};

    // Add the new card to cards collection
    allCards[newCard.id] = newCard;

    // Save the updated cards collection
    localStorage.setItem(key, JSON.stringify(allCards));
  },
  read: function() {
    // Get all the cards
    let allCards = JSON.parse(localStorage.getItem(key)) || {};

    // Return the cards as an array
    return Object.values(allCards);
  },
  update: async function(id, newData, options = {}) {
    // Get all the cards
    let allCards = JSON.parse(localStorage.getItem(key)) || {};

    // Update the specific card with the new data
    allCards[id] = { ...allCards[id], ...newData };

    // Don't update data on the remote database if remote flag is false
    if (options.remote !== false) {
      let remoteWorking = await remote.status();
      if (remoteWorking === true) {
        await remote.update(id, allCards[id]);
      } else {
        let remoteFails = JSON.parse(localStorage.getItem("remoteFails")) || {};
        remoteFails[id] = "update";
        localStorage.setItem("remoteFails", JSON.stringify(remoteFails));
      }
    }

    // Save the updated cards collection
    localStorage.setItem(key, JSON.stringify(allCards));
  },
  delete: async function(id) {
    // Get all the cards
    let allCards = JSON.parse(localStorage.getItem(key)) || {};

    let remoteWorking = await remote.status();
    if (remoteWorking === true) {
      await remote.delete(id);
    } else {
      let remoteFails = JSON.parse(localStorage.getItem("remoteFails")) || {};
      remoteFails[id] = "delete";
      localStorage.setItem("remoteFails", JSON.stringify(remoteFails));
    }

    // delete the card from the cards collection
    delete allCards[id];

    // Save the updated cards collection
    localStorage.setItem(key, JSON.stringify(allCards));
  },
  restore: async function() {
    let remoteWorking = await remote.status();
    if (remoteWorking === true) {
      let cards = await remote.read();

      // Get all the cards
      let allCards = {};

      cards.forEach(item => {
        let { _id, ...card } = item;
        card.id = _id;
        // Add the new card to cards collection
        allCards[_id] = card;
      });

      // Save the updated cards collection
      localStorage.setItem(key, JSON.stringify(allCards));
    }
  }
};

export { db };
