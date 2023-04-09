import { useState } from "react";

import "./App.css";
import Cards from "./components/Cards";
import TopBar from "./components/TopBar";
import EditCard from "./components/EditCard";
import DeleteCard from "./components/DeleteCard";

function App() {
  // This is for the edit card modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [cardToEdit, setCardToEdit] = useState({});

  // This is for the delete card modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [cardToDelete, setCardToDelete] = useState({});

  // This is to ensure that the updated cards in local storage get reloaded into the app
  const [reloadCards, setReloadCards] = useState(0);

  // This is so that the top-bar can have awareness of the number of cards and adjust itself accordingly
  const [numberOfCards, setNumberOfCards] = useState();

  return (
    <>
      <TopBar
        setShowEditModal={setShowEditModal}
        setCardToEdit={setCardToEdit}
        numberOfCards={numberOfCards}
      />
      <Cards
        setShowEditModal={setShowEditModal}
        setCardToEdit={setCardToEdit}
        setCardToDelete={setCardToDelete}
        setShowDeleteModal={setShowDeleteModal}
        reloadCards={reloadCards}
        setNumberOfCards={setNumberOfCards}
      />
      {showEditModal && (
        <EditCard
          card={cardToEdit}
          close={() => setShowEditModal(false)}
          setReloadCards={setReloadCards}
        />
      )}
      {showDeleteModal && (
        <DeleteCard
          card={cardToDelete}
          close={() => setShowDeleteModal(false)}
          setReloadCards={setReloadCards}
        />
      )}
    </>
  );
}

export default App;
