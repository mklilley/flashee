// See https://github.com/vasanthv/jsonbox for full details of how the
// jsonbox api works

// This function creates a new box ID and came from inspecting
// the index.html code of https://jsonbox.io/
function createUniqueID() {
  var dt = new Date().getTime();
  var uuid = "xxyxxxxxxyxxxxxyxxxx".replace(/[xy]/g, function (c) {
    var r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uuid;
}

// from https://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid
// Used to create a valid api-key
function createUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// API_BASE: "http://localhost:3000/flash_",
// API_BASE_META: "http://localhost:3000/_meta/flash_",

// Box object is composed of:
// API_BASE: Used to make most api requests to create, read, update and delete data
// API_BASE_META: Used to test if the service is available
// API_URL: The complete URL for most api requests
// API_META_URL: The complete URL for service checks
// id     : The jsonbox ID currently being used
// apiKey : The jsonbox apiKey assigned to the current jsonbox
// status : Function to check whether jsonbox is up and running
// switch : Function to switch the existing jsonbox ID to a new one specified by the user
// create : Function to create a new "document" in the jsonbox
// read   : Function to get data for a specific "document" from the jsonbox or
//          get all documents
// update : Function to update the data for a specific "document" from the jsonbox
// delete : Function to delete a specific "document" from the jsonbox
const box = {
  API_BASE: "https://json.lilley.io/flash_",
  API_BASE_META: "https://json.lilley.io/_meta/flash_",
  API_URL: "",
  API_META_URL: "",

  init: async function (boxID, apiKey) {
    if (boxID === undefined && apiKey === undefined) {
      // No arguments supplied to the function - load data from local storage or
      // create jsonbox credentials

      // Check to see if the app is already storing data in a jsonbox and if not then
      // create a new boxID to be used as such.
      boxID = localStorage.getItem("jsonbox");
      if (boxID === null) {
        boxID = createUniqueID();
        localStorage.setItem("jsonbox", boxID);
        // Set another storage key for the purpose of identifying the users personal
        // jsonbox which might be different from the current box
        localStorage.setItem("myJsonbox", boxID);
      }

      apiKey = localStorage.getItem("apiKey");
      if (apiKey === null) {
        apiKey = createUUID();
        localStorage.setItem("apiKey", apiKey);
        // Set another storage key for the purpose of identifying the users personal
        // apiKey which might be different from the current apiKey
        localStorage.setItem("myApiKey", apiKey);
      }
    } else {
      // If arguments are supplied to init then we're switching json box
      localStorage.setItem("jsonbox", boxID);
      localStorage.setItem("apiKey", apiKey);
    }

    this.API_URL = `${this.API_BASE}${boxID}`;
    this.API_META_URL = `${this.API_BASE_META}${boxID}`;

    return true;
  },

  id: async function (options = {}) {
    let boxID;
    if (options.my === true) {
      boxID = localStorage.getItem("myJsonbox");
    } else {
      boxID = localStorage.getItem("jsonbox");
    }
    return boxID;
  },

  apiKey: async function (options = {}) {
    let apiKey;
    if (options.my === true) {
      apiKey = localStorage.getItem("myApiKey");
    } else {
      apiKey = localStorage.getItem("apiKey");
    }
    return apiKey;
  },

  status: async function () {
    const options = {
      method: "GET",
    };

    const response = await fetch(this.API_META_URL, options).catch((err) => {
      console.log(err);
    });

    if ((response || {}).ok) {
      let json = await response.json();
      // eslint-disable-next-line
      let { _count, _boxLastModified, ...discarded } = json;
      let subset;
      if (_boxLastModified) {
        subset = { numCards: _count, remoteUpdatedOn: _boxLastModified };
      } else {
        subset = { numCards: _count };
      }
      return subset;
    } else {
      return false;
    }
  },

  switch: async function (newBoxID, newApiKey) {
    // In case the HTML code doesn't work as expected, lower case and trim user input
    newBoxID = newBoxID.toLowerCase().trim();
    newApiKey = newApiKey.toLowerCase().trim();

    // Check that the user isn't trying to switch to the current box they are already in
    const currentBoxID = await this.id();
    if (newBoxID === currentBoxID) {
      throw new Error("You are already viewing cards from this box.");
    }

    // Check that the user has entered a valid boxID, i.e.
    // 20 character HEX string
    let isHex20 = newBoxID.match("^[0-9a-f]{20}$");
    // If user entered a newApiKey for this box, then check it is a valid UUID
    let isUUID;
    if (newApiKey) {
      isUUID = newApiKey.match("^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$");
    }

    let errorMessage = "";
    if (isHex20 === null) {
      errorMessage += "Opps! Box ID must be 20 characters made up of numbers and the letters a-f. ";
    }
    if (isUUID === null) {
      errorMessage += "Storage key must be a valid UUID.";
    }

    if (isHex20 === null || isUUID === null) {
      throw new Error(errorMessage);
    }

    // If no apiKey is supplied then we'll store a blank apiKey (this will eventually be
    // treated as a publicly editable box TODO
    const apiKey = newApiKey ? newApiKey : "";
    // In there are no validation errors in newBoxID or newApiKey then change boxID and apiKey
    this.init(newBoxID, apiKey);

    return true;
  },

  create: async function (data) {
    const options = {
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    };
    const apiKey = await this.apiKey();
    if (apiKey) {
      options.headers["X-API-KEY"] = apiKey;
    }

    const response = await fetch(this.API_URL, options).catch((err) => {
      console.log(err);
    });

    if ((response || {}).ok) {
      // if response is ok then return the response with some modifications
      //  the response echos back the data with _id, and _createdOn. We will rename
      // the _id for convenience in referencing in the app.
      let json = await response.json();
      json.forEach((el, idx) => {
        el.id = el["_id"];
        delete el["_id"];
        json[idx] = el;
      });
      return json;
    } else {
      return false;
    }
  },

  read: async function (id) {
    const options = {
      method: "GET",
    };
    let response;

    if (id === undefined) {
      response = await fetch(`${this.API_URL}?limit=1000`, options).catch((err) => {
        console.log(err);
      });
    } else {
      response = await fetch(`${this.API_URL}/${id}`, options).catch((err) => {
        console.log(err);
      });
    }

    if ((response || {}).ok) {
      let json = await response.json();
      let allItems = {};

      // Rename the json data "_id" keys to "id"
      json.forEach((item) => {
        item.id = item["_id"];
        delete item["_id"];
        // Add the update item to allItems
        allItems[item.id] = item;
      });

      return allItems;
    } else {
      return false;
    }
  },

  update: async function (id, data) {
    const options = {
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
      method: "PUT",
    };
    const apiKey = await this.apiKey();
    if (apiKey) {
      options.headers["X-API-KEY"] = apiKey;
    }

    const response = await fetch(`${this.API_URL}/${id}`, options).catch((err) => {
      console.log(err);
    });

    if ((response || {}).ok) {
      let json = await response.json();
      return json;
    } else {
      return false;
    }
  },

  delete: async function (id) {
    const options = {
      method: "DELETE",
    };
    const apiKey = await this.apiKey();
    if (apiKey) {
      options.headers = { "X-API-KEY": apiKey };
    }
    // can delete a single record or all of the records
    const URL = id ? `${this.API_URL}/${id}` : this.API_URL;
    const response = await fetch(URL, options).catch((err) => {
      console.log(err);
    });

    if ((response || {}).ok) {
      let json = await response.json();
      return json;
    } else {
      return false;
    }
  },
};

export { box, createUniqueID, createUUID };
