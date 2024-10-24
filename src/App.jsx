import { useState } from "react";

import "./App.css";
import Cards from "./components/Cards";
import TopBar from "./components/TopBar";
import EditCard from "./components/EditCard";
import DeleteCard from "./components/DeleteCard";
import Settings from "./components/Settings";

function App() {
  // This is for the edit card modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [cardToEdit, setCardToEdit] = useState({});

  // This is for the delete card modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [cardToDelete, setCardToDelete] = useState({});

  // This is for the settings modal
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  return (
    <>
      <TopBar
        setShowSettingsModal = {setShowSettingsModal}
        setShowEditModal={setShowEditModal}
        setCardToEdit={setCardToEdit}
      />
      <Cards
        setShowEditModal={setShowEditModal}
        setCardToEdit={setCardToEdit}
        setCardToDelete={setCardToDelete}
        setShowDeleteModal={setShowDeleteModal}
      />
      {showEditModal && (
        <EditCard
          card={cardToEdit}
          close={() => setShowEditModal(false)}
        />
      )}
      {showDeleteModal && (
        <DeleteCard
          card={cardToDelete}
          close={() => setShowDeleteModal(false)}
        />
      )}
        {showSettingsModal && (
        <Settings
          close={() => setShowSettingsModal(false)}
        />
      )}
    </>
  );
}

export default App;
