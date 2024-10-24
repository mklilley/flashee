import { useState } from "react";
import { useRecoilState } from 'recoil';
import { showEditModalState, showDeleteModalState, showSettingsModalState } from '@globalState';

import "./App.css";
import Cards from "./components/Cards";
import TopBar from "./components/TopBar";
import EditCard from "./components/EditCard";
import DeleteCard from "./components/DeleteCard";
import Settings from "./components/Settings";

function App() {
  const [showEditModal, setShowEditModal] = useRecoilState(showEditModalState);
  const [showDeleteModal, setShowDeleteModal] = useRecoilState(showDeleteModalState);
  const [showSettingsModal, setShowSettingsModal] = useRecoilState(showSettingsModalState);



  const [cardToEdit, setCardToEdit] = useState({});
  const [cardToDelete, setCardToDelete] = useState({});


  return (
    <>
      <TopBar setCardToEdit={setCardToEdit}/>
      <Cards
        setCardToEdit={setCardToEdit}
        setCardToDelete={setCardToDelete}
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
