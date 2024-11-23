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
import Switch from "./components/Settings/OnlineStoragePanel/Switch";

function App() {
  const setBoxStatus = useSetRecoilState(boxStatusState);
  const [showEditModal, setShowEditModal] = useRecoilState(showEditModalState);
  const [showDeleteModal, setShowDeleteModal] = useRecoilState(showDeleteModalState);
  const [showSettingsModal, setShowSettingsModal] = useRecoilState(showSettingsModalState);

  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  const haveSeenWelcome = useRecoilValue(haveSeenWelcomeState);

  const [showSwitchModal, setShowSwitchModal] = useState(false);
  const [boxIDFromURL, setBoxIDFromURL] = useState("");

  useEffect(() => {
    const init = async () => {
      // Check on the remote storage box status even if user hasn't opted for it
      // We do this in case the user decides they want to start using remote storage.
      // We always want to know if there is a problem with online
      const boxStatus = await db.status();
      setBoxStatus(boxStatus);

      // Check URL for box parameter. If it exists then load cards from the Online
      // storage box with the corresponding ID.
      const params = new URLSearchParams(window.location.search);
      if (params.has("box")) {
        // TODO set canEdit
        setBoxIDFromURL(params.get("box"));
        setShowSwitchModal(true);
        window.history.replaceState(null, null, window.location.pathname);
      }
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
      {showSwitchModal && <Switch boxID={boxIDFromURL} close={() => setShowSwitchModal(false)} />}
    </>
  );
}

export default App;
