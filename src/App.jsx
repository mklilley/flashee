import { useState, useEffect, Suspense } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  showEditModalState,
  showDeleteModalState,
  showSettingsModalState,
  haveSeenWelcomeState,
  boxStatusState,
  useRemoteStorageState,
  useSyncWarningsState,
} from "@globalState";

import { useRetryRemote } from "./hooks/useRetryRemote";

import { db } from "./services/storage";

import "./App.css";
import Cards from "./components/Cards";
import TopBar from "./components/TopBar";
import EditCard from "./components/EditCard";
import DeleteCard from "./components/DeleteCard";
import Settings from "./components/Settings";
import Welcome from "./components/Welcome";
import Switch from "./components/Settings/OnlineStoragePanel/Switch";
import Sync from "./components/Sync";
import { use } from "react";

function App() {
  const [boxStatus, setBoxStatus] = useRecoilState(boxStatusState);
  const [showEditModal, setShowEditModal] = useRecoilState(showEditModalState);
  const [showDeleteModal, setShowDeleteModal] = useRecoilState(showDeleteModalState);
  const [showSettingsModal, setShowSettingsModal] = useRecoilState(showSettingsModalState);

  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  const haveSeenWelcome = useRecoilValue(haveSeenWelcomeState);

  const [showSwitchModal, setShowSwitchModal] = useState(false);
  const [boxIDFromURL, setBoxIDFromURL] = useState("");

  const useRemoteStorage = useRecoilValue(useRemoteStorageState);
  const useSyncWarnings = useRecoilValue(useSyncWarningsState);
  const [showSyncModal, setShowSyncModal] = useState(false);

  const retryRemote = useRetryRemote();

  useEffect(() => {
    async function init() {
      // Check on the remote storage box status even if user hasn't opted for it
      // We do this in case the user decides they want to start using remote storage.
      // We always want to know if there is a problem with online storage.
      const boxStatus = await db.status();
      setBoxStatus(boxStatus);

      if (useRemoteStorage && boxStatus) {
        // If the user has opted to use remote storage then we want to keep the data alive
        // because the data in jsonbox is only stored for 360 days.
        keepDataAlive();
        // If the user has opted to see sync warnings then we want to check if the
        // locally stored cards are out of sync with the remote storage.
        if (useSyncWarnings && boxStatus.remoteUpdatedOn) {
          checkForRemoteCardChanges(boxStatus);
        }
        // Finally, we want to retry any failed remote operations
        retryRemote();
      }

      // Check URL for box parameter. If it exists then load cards from the Online
      // storage box with the corresponding ID.
      const params = new URLSearchParams(window.location.search);
      if (params.has("box")) {
        setBoxIDFromURL(params.get("box"));
        setShowSwitchModal(true);
        window.history.replaceState(null, null, window.location.pathname);
      }
    }

    function checkForRemoteCardChanges(boxStatus) {
      // If the user has opted to see sync warnings then we want to check if the
      // locally stored cards are out of sync with the remote storage.
      if (new Date(boxStatus.remoteUpdatedOn) > new Date(localStorage.remoteUpdatedOn)) {
        setShowSyncModal(true);
      }
    }

    async function keepDataAlive() {
      // Data in jsonbox is only stored for 360 days. Every time the user reads/updates
      // a card on the database, the 360 day countdown is reset for that card.
      // db.keepAlive() reads all cards from the database and thus resets the clock for
      // all of them.
      let msInDay = 1000 * 60 * 60 * 24;
      let numDaysSinceKeepAlive =
        (new Date() - Date.parse(localStorage.lastKeepAliveDate)) / msInDay;
      if (numDaysSinceKeepAlive > 90) {
        let keepAliveSuccess = await db.keepAlive();
        if (keepAliveSuccess) {
          localStorage.lastKeepAliveDate = new Date();
        } else {
          alert(
            `Your online storage data will be deleted in ${Math.round(
              360 - numDaysSinceKeepAlive
            )} days`
          );
        }
      }
    }

    init();
  }, []);

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <TopBar />
        <Cards />
      </Suspense>
      {showEditModal && <EditCard close={() => setShowEditModal(false)} />}
      {showDeleteModal && <DeleteCard close={() => setShowDeleteModal(false)} />}
      {showSettingsModal && <Settings close={() => setShowSettingsModal(false)} />}
      {showWelcomeModal && !haveSeenWelcome && <Welcome close={() => setShowWelcomeModal(false)} />}
      {showSwitchModal && <Switch boxID={boxIDFromURL} close={() => setShowSwitchModal(false)} />}
      {showSyncModal && <Sync boxStatus={boxStatus} close={() => setShowSyncModal(false)} />}
    </>
  );
}

export default App;
