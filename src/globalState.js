import { atom } from 'recoil';

// This is for the edit card modal. It's set when the EditModal is closed. It's also
// set when a user taps on edit icon in the Card component and also when the user taps on
// the blank placeholder card in Cards.
export const showEditModalState = atom({
  key: 'showEditModalState',
  default: false,
});
// This is for the edit card modal. It is set from Cards when a user taps on edit in the Card 
// component. It can also be set from TopBar when user creates a new card. It's used in the EditCard
// component.
export const cardToEditState = atom({
  key: 'cardToEditState',
  default: {},
});

// This is for the delete card modal. It's set when the DeleteModal is closed. It's also
// set when the user taps on the delete icon in the Card component
export const showDeleteModalState = atom({
  key: 'showDeleteModalState',
  default: false,
});
// This is for the delete card modal.  It is set from Cards when a user taps on delete in the Card 
// component.  It's used in the DeleteCard component.
export const cardToDeleteState = atom({
  key: 'cardToDeleteState',
  default: {},
});

// This is for the settings modal
export const showSettingsModalState = atom({
  key: 'showSettingsModalState',
  default: false,
});

// This is to ensure that the updated cards in local storage get reloaded into the app.
// This is set wherever the cards update: EditCard, DeleteCard, YourDataPanel.
// This is used by Cards and also the SearchBar which uses it to trigger reindexing
export const reloadCardsState = atom({
  key: 'reloadCardsState',
  default: 0,
});

 // This is to ensure the top-bar has awareness of the number of cards in order to present different UI for zero cards vs non-zero
 // It's also used in YourDataPanel to show the total number of cards you've got
 // The totalNumberOfCards is set in the cards component after the cards have been rendered
export const totalNumberOfCardsState = atom({
  key: 'totalNumberOfCardsState',
  default: undefined,
});

// This is to ensure that SearchBar (inside of TopBar) can set the search results and the Cards component can read the search results
// in order to display a filtered view
export const searchResultsState = atom({
  key: 'searchResultsState',
  default: undefined,
});

// This allows us to create cards with the same number of "reads" as the other cards in the deck.
// This is used to ensure that new cards don't perpetually stay at the top of the pile
// This is set inside the Cards component and used wherever new cards are made, i.e. the EditCard and YourDataPanel
// components
export const minReadsState = atom({
  key: 'minReadsState',
  default: 0,
});