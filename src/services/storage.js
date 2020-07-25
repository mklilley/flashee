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

// If remote database fails to respond, store the id of the failed card and
// also what function failed, e.g. "create", "update" etc
function recordRemoteFail(id, typeOfFail) {
  let remoteFails = JSON.parse(localStorage.getItem("remoteFails")) || {};
  remoteFails[id] = typeOfFail;
  localStorage.setItem("remoteFails", JSON.stringify(remoteFails));
}

// key to identify the collection of cards in the data store
const key = "cards";

const db = {
  create: async function(newCard) {
    let result = await remote.create(newCard);

    // The call to the remote is successful
    if (result) {
      newCard.id = result["_id"];
    }
    // The call to the remote is unsuccessful
    else {
      let i = id();
      newCard.id = i;
      recordRemoteFail(i, "create");
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
      let result = await remote.update(id, allCards[id]);
      // The call to the remote is unsuccessful
      if (!result) {
        recordRemoteFail(id, "update");
      }
    }

    // Save the updated cards collection
    localStorage.setItem(key, JSON.stringify(allCards));
  },
  delete: async function(id) {
    // Get all the cards
    let allCards = JSON.parse(localStorage.getItem(key)) || {};

    let result = await remote.delete(id);
    // The call to the remote is unsuccessful
    if (!result) {
      recordRemoteFail(id, "delete");
    }

    // delete the card from the cards collection
    delete allCards[id];

    // Save the updated cards collection
    localStorage.setItem(key, JSON.stringify(allCards));
  },
  restore: async function() {
    let cards = await remote.read();

    // The call to the remote is successful
    if (cards) {
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
    // The call to the remote is unsuccessful
    else {
      // TODO
    }
  }
};

export { db };
