import { box as remote } from "./jsonbox";

// function to create random id for each flash card - inspired by
// https://stackoverflow.com/questions/105034/how-to-create-guid-uuid
function id() {
  return "xxxxxxxxxxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// If remote database fails to respond, store the id of the failed card and
// also what function failed, e.g. "create", "update" etc
function recordRemoteFail(id, typeOfFail) {
  const remoteFails = JSON.parse(localStorage.getItem("remoteFails")) || [];
  remoteFails.push({ id, type: typeOfFail });
  localStorage.setItem("remoteFails", JSON.stringify(remoteFails));
}

// key to identify the collection of cards in the data store
const key = "cards";

const db = {
  init: async function () {
    return await remote.init();
  },
  id: async function (options = {}) {
    return await remote.id(options);
  },
  apiKey: async function (options = {}) {
    return await remote.apiKey(options);
  },
  status: async function () {
    return await remote.status();
  },
  switch: async function (storageID, apiKey) {
    return await remote.switch(storageID, apiKey);
  },
  keepAlive: async function () {
    return await remote.read();
  },
  create: async function (newCards, options = {}) {
    // Only create data on the remote database if remote flag is true
    if (options.remote === true) {
      let result = await remote.create(newCards);

      // The call to the remote is successful
      if (result) {
        // The output from remote.create() should be to echo back the card data
        // with an extra key "id" which is provided by the remote database
        newCards = result;
        // Store last update time in local storage so we can check when local storage
        // is out of sync with server
        let status = await this.status();
        localStorage.setItem("remoteUpdatedOn", status.remoteUpdatedOn);
      }
      // The call to the remote is unsuccessful
      if (!result) {
        if (!options.retry) {
          // If the remote database fails and we're trying to create for the first time,
          // we need to log the failure and provide  an id for the card so we can save
          // it in the localStorage and log the failure
          newCards.forEach((el, idx) => {
            let i = id();
            newCards[idx].id = i;
            recordRemoteFail(i, "create");
          });

          // Get all the cards
          let allCards = JSON.parse(localStorage.getItem(key)) || {};

          newCards.forEach((el) => {
            // Add the new cards to cards collection
            allCards[el.id] = el;
          });

          // Save the updated cards collection
          localStorage.setItem(key, JSON.stringify(allCards));

          return false;
        } else {
          // If the remote database fails when we're retrying a failed create operation, then
          // we don't want to recreate a local card again, we'll simply return false
          return false;
        }
      }
    } else {
      // If only using local storage we need to provide an
      // id for the card so we can save it in the localStorage
      newCards.forEach((el, idx) => {
        let i = id();
        newCards[idx].id = i;
      });
    }

    // Get all the cards
    let allCards = JSON.parse(localStorage.getItem(key)) || {};

    newCards.forEach((el) => {
      // Add the new cards to cards collection
      allCards[el.id] = el;
    });

    // Save the updated cards collection
    localStorage.setItem(key, JSON.stringify(allCards));

    return true;
  },
  read: async function (options = {}) {
    let cards;

    // Go get all data from remote database if remote flag is true
    if (options.remote === true) {
      // Get all the cards
      cards = await remote.read();

      // The call to the remote is successful
      if (cards) {
        // Save the cards to the localStorage
        localStorage.setItem(key, JSON.stringify(cards));
        // If there are cards in the remote storage then add the last update time
        // to local storage
        if (Object.keys(cards).length !== 0) {
          let status = await this.status();
          localStorage.setItem("remoteUpdatedOn", status.remoteUpdatedOn);
        }
      }
      //
      else {
        // TODO
      }
    }
    // If no remote flag, then read all data from local storage
    else {
      // Get all the cards
      cards = JSON.parse(localStorage.getItem(key)) || {};
    }

    // Return the cards as an array
    return Object.values(cards);
  },
  update: async function (id, newData, options = {}) {
    // Get all the cards
    let allCards = JSON.parse(localStorage.getItem(key)) || {};

    // Update the specific card with the new data
    allCards[id] = { ...allCards[id], ...newData };

    // Only update data on the remote database if remote flag is true
    if (options.remote === true) {
      let result = await remote.update(id, allCards[id]);

      // The call to the remote is successful
      if (result) {
        allCards[id]["_updatedOn"] = result["_updatedOn"];
        // Store last update time in local storage so we can check when local storage
        // is out of sync with server
        let status = await this.status();
        localStorage.setItem("remoteUpdatedOn", status.remoteUpdatedOn);
      }
      // The call to the remote is unsuccessful
      else {
        // The call to the remote is unsuccessful and it's the first time we're trying to update
        // then we need to log the failure
        if (!options.retry) {
          recordRemoteFail(id, "update");
        }

        // Save the updated cards collection
        localStorage.setItem(key, JSON.stringify(allCards));

        return false;
      }
    }

    // Save the updated cards collection
    localStorage.setItem(key, JSON.stringify(allCards));

    return true;
  },
  delete: async function (id, options = {}) {
    if (id) {
      // deleting a specific card
      if (!options.retry) {
        // If retry flag is not set then we're attempting to delete for the first time
        // so we need to remove the card from local storage. If delete on remote fails then
        // we'll only need to retry delete on the remote database.

        // Get all the cards
        let allCards = JSON.parse(localStorage.getItem(key)) || {};

        // delete the card from the cards collection
        delete allCards[id];

        // Save the updated cards collection
        localStorage.setItem(key, JSON.stringify(allCards));
      }

      // Only delete data on the remote database if remote flag is true
      if (options.remote === true) {
        const result = await remote.delete(id);
        // The call to the remote is successful
        if (result) {
          // Store last update time in local storage so we can check when local storage
          // is out of sync with server
          let status = await this.status();
          localStorage.setItem("remoteUpdatedOn", status.remoteUpdatedOn);
        } else {
          // The call to the remote is unsuccessful and it's the first time we're trying to delete
          // then we need to log the failure
          if (!options.retry) {
            recordRemoteFail(id, "delete");
          }

          return false;
        }
      }
    } else {
      // deleting all cards

      if (!options.retry) {
        // If retry flag is not set then we're attempting to delete for the first time
        // so we need to remove all cards from local storage. If delete on remote fails then
        // we'll only need to retry delete on the remote database.

        localStorage.setItem(key, JSON.stringify({}));
      }

      if (options.remote === true) {
        const result = await remote.delete();
        // The call to the remote is successful
        if (result) {
          // Store last update time in local storage so we can check when local storage
          // is out of sync with server
          let status = await this.status();
          localStorage.setItem("remoteUpdatedOn", status.remoteUpdatedOn);
        } else {
          // The call to the remote is unsuccessful and it's the first time we're trying to delete
          // then we need to log the failure
          if (!options.retry) {
            recordRemoteFail("all", "delete");
          }
          return false;
        }
      }
    }

    return true;
  },
};

export { db };
