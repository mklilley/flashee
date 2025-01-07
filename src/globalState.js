import { atom, selector } from "recoil";

import { db } from "./services/storage";

// This is used when we want to keep recoil atoms in sync with local storage
const localStorageEffect =
  (key) =>
  ({ setSelf, onSet }) => {
    // Load the initial value from localStorage
    const savedValue = localStorage.getItem(key);
    if (savedValue != null) {
      try {
        setSelf(JSON.parse(savedValue));
      } catch (error) {
        setSelf(savedValue);
      }
    }

    // Update localStorage whenever the atom's value changes
    onSet((newValue, _, isReset) => {
      isReset ? localStorage.removeItem(key) : localStorage.setItem(key, newValue);
    });
  };

// This is for the edit card modal. It's set when the EditModal is closed. It's also
// set when a user taps on edit icon in the Card component and also when the user taps on
// the blank placeholder card in Cards.
export const showEditModalState = atom({
  key: "showEditModalState",
  default: false,
});
// This is for the edit card modal. It is set from Cards when a user taps on edit in the Card
// component. It can also be set from TopBar when user creates a new card. It's used in the EditCard
// component.
export const cardToEditState = atom({
  key: "cardToEditState",
  default: {},
});

// This is for the delete card modal. It's set when the DeleteModal is closed. It's also
// set when the user taps on the delete icon in the Card component
export const showDeleteModalState = atom({
  key: "showDeleteModalState",
  default: false,
});
// This is for the delete card modal.  It is set from Cards when a user taps on delete in the Card
// component.  It's used in the DeleteCard component.
export const cardToDeleteState = atom({
  key: "cardToDeleteState",
  default: {},
});

// This is for the settings modal. It's set to be true from the TopBar component and is used
// to display the Settings component from App.
export const showSettingsModalState = atom({
  key: "showSettingsModalState",
  default: false,
});

// This is to ensure that the updated cards in local storage get reloaded into the app.
// This is set wherever the cards update: EditCard, DeleteCard, YourDataPanel.
// This is used by Cards and also the SearchBar which uses it to trigger reindexing
export const reloadCardsState = atom({
  key: "reloadCardsState",
  default: 0,
});

// This is to ensure the top-bar has awareness of the number of cards in order to present different UI for zero cards vs non-zero
// It's also used in YourDataPanel to show the total number of cards you've got
// The totalNumberOfCards is set in the cards component after the cards have been rendered
export const totalNumberOfCardsState = atom({
  key: "totalNumberOfCardsState",
  default: undefined,
});

// This is to ensure that SearchBar (inside of TopBar) can set the search results and the Cards component can read the search results
// in order to display a filtered view
export const searchResultsState = atom({
  key: "searchResultsState",
  default: undefined,
});

// This allows us to create cards with the same number of "reads" as the other cards in the deck.
// This is used to ensure that new cards don't perpetually stay at the top of the pile
// This is set inside the Cards component and used wherever new cards are made, i.e. the EditCard and YourDataPanel
// components
export const minReadsState = atom({
  key: "minReadsState",
  default: 0,
});

// This keeps track of wether the user has seen the welcome screen before so that the app
// can show it on first time the app is loaded. This is set to be true in the Welcome component
export const haveSeenWelcomeState = atom({
  key: "haveSeenWelcomeState",
  default: false,
  effects: [localStorageEffect("haveSeenWelcome")],
});

// This keeps track of whether the user has opted to store their cards in remote storage.
// This is set in the OnlineStoragePanel component and affects the display of the welcome screen
// in addition to affecting the creation and modification of cards in the storage service
export const useRemoteStorageState = atom({
  key: "useRemoteStorageState",
  default: true,
  effects: [localStorageEffect("useRemoteStorage")],
});

// This keeps track of whether the user has opted to see warnings about when their locally stored cards
// are out of sync with the remote storage. This is set in the Settings component.
export const useSyncWarningsState = atom({
  key: "useSyncWarningsState",
  default: true,
  effects: [localStorageEffect("useSyncWarnings")],
});

// This keeps track of the user's jsonbox ID. It pulls it in from local storage when the app loads
// It's displayed on the welcome screen and in settings
// This is initalised in localstorage before the app loads in man.jsx
export const myBoxIDState = atom({
  key: "myBoxIDState",
  default: undefined,
  effects: [localStorageEffect("myJsonbox")],
});

// This keeps track of the user's jsonbox apiKey. It pulls it in from local storage when the app loads
// It's displayed on the welcome screen and in settings
// This is initalised in localstorage before the app loads in man.jsx
export const myApiKeyState = atom({
  key: "myApiKeyState",
  default: undefined,
  effects: [localStorageEffect("myApiKey")],
});

// This keeps track of whether the remote storage is working. It's set in App and used in components
// that need to call the database, e.g. deleting cards, creating cards.
export const boxStatusState = atom({
  key: "boxStatusState",
  default: false,
});

// This keeps track of whether a user has switched to another storage in order to give them
// options to switch back. This is set in OnlineStorage and Switch components when the user
// switches to a new box or switches back to their own box
export const usingMyBoxState = atom({
  key: "usingMyBoxState",
  default: true,
  effects: [localStorageEffect("usingMyJsonBox")],
});

// This responds to changes in usingMyBoxState and checks to see whether the user
// has specified an ApiKey. If not then it's a read only box.
export const readOnlyBoxState = selector({
  key: "readOnlyBoxState",
  get: async ({ get }) => {
    const usingMyBox = get(usingMyBoxState);
    if (!usingMyBox) {
      try {
        const apiKey = await db.apiKey();
        return apiKey === "";
      } catch (error) {
        console.error("Error fetching API key:", error);
        throw error;
      }
    }
    return false;
  },
});
