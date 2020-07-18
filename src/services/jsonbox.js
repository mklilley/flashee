// See https://github.com/vasanthv/jsonbox for full details of how the
// jsonbox api works

// This function creates a new box ID and came from inspecting
// the index.html code of ttps://jsonbox.io/
function createUniqueID() {
  var dt = new Date().getTime();
  var uuid = "xxyxxxxxxyxxxxxyxxxx".replace(/[xy]/g, function(c) {
    var r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uuid;
}

// This API_BASE is used to make most api requests to create, read, update and
// delete data
const API_BASE = "https://jsonbox.io/box_";

// This API_BASE_META is being used to test if the service is available
const API_BASE_META = "https://jsonbox.io/_meta/box_";

// Check to see if the app is already storing data in a jsonbox and if not then
// create a new boxID to be used as such.
let boxID = localStorage.getItem("jsonbox");
if (boxID === null) {
  boxID = createUniqueID();
  localStorage.setItem("jsonbox", boxID);
}

const API_URL = API_BASE + boxID;
const API_META_URL = API_BASE_META + boxID;

// Box object is composed of:
// id     : The jsonbox ID currently being used
// status : Function to check whether jsonbox is up and running
// create : Function to create a new "document" in the jsonbox
// read   : Function to get data for a specific "document" from the jsonbox or
//          get all documents
// update : Function to update the data for a specific "document" from the jsonbox
// delete : Function to delete a specific "document" from the jsonbox
const box = {
  id: boxID,
  status: async function() {
    const options = {
      method: "GET"
    };

    const response = await fetch(API_META_URL, options);

    if (response.ok) {
      return true;
    } else {
      return false;
    }
  },
  create: async function(data) {
    const options = {
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
      method: "POST"
    };

    const response = await fetch(API_URL, options);

    if (response.ok) {
      return response.json();
    }
  },
  read: async function(id) {
    const options = {
      method: "GET"
    };
    let response;

    if (id === undefined) {
      response = await fetch(API_URL, options);
    } else {
      response = await fetch(API_URL + "/" + id, options);
    }

    if (response.ok) {
      return response.json();
    }
  },
  update: async function(id, data) {
    const options = {
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
      method: "PUT"
    };

    const response = await fetch(API_URL + "/" + id, options);

    if (response.ok) {
      return response.json();
    }
  },
  delete: async function(id) {
    const options = {
      method: "DELETE"
    };
    let response;

    response = await fetch(API_URL + "/" + id, options);

    if (response.ok) {
      return response.json();
    }
  }
};

export { box };
