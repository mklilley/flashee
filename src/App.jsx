import { useState, useEffect } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  showEditModalState,
  showDeleteModalState,
  showSettingsModalState,
  haveSeenWelcomeState,
  boxStatusState,
} from "@globalState";

import { db } from "./services/storage";

import "./App.css";
import Cards from "./components/Cards";
import TopBar from "./components/TopBar";
import EditCard from "./components/EditCard";
import DeleteCard from "./components/DeleteCard";
import Settings from "./components/Settings";
import Welcome from "./components/Welcome";

function App() {
  const setBoxStatus = useSetRecoilState(boxStatusState);
  const [showEditModal, setShowEditModal] = useRecoilState(showEditModalState);
  const [showDeleteModal, setShowDeleteModal] = useRecoilState(showDeleteModalState);
  const [showSettingsModal, setShowSettingsModal] = useRecoilState(showSettingsModalState);

  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  const haveSeenWelcome = useRecoilValue(haveSeenWelcomeState);

  useEffect(() => {
    const init = async () => {
      const boxStatus = await db.status();
      setBoxStatus(boxStatus);
    };

    init();
  }, []);

  return (
    <>
      <TopBar />
      <Cards />
      {showEditModal && <EditCard close={() => setShowEditModal(false)} />}
      {showDeleteModal && <DeleteCard close={() => setShowDeleteModal(false)} />}
      {showSettingsModal && <Settings close={() => setShowSettingsModal(false)} />}
      {showWelcomeModal && !haveSeenWelcome && <Welcome close={() => setShowWelcomeModal(false)} />}
    </>
  );
}

export default App;
