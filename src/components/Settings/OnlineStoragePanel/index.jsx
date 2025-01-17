import Panel from "../../Panel";

import { useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  useRemoteStorageState,
  myBoxIDState,
  myApiKeyState,
  boxStatusState,
  reloadCardsState,
  usingMyBoxState,
  readOnlyBoxState,
  useSyncWarningsState,
} from "@globalState";

import Switch from "./Switch";

import { db } from "../../../services/storage";

import { useSwitchToMyBox } from "../../../hooks/useSwitchToMyBox";

function OnlineStoragePanel() {
  const [showSwitchModal, setShowSwitchModal] = useState(false);
  const [useRemoteStorage, setUseRemoteStorage] = useRecoilState(useRemoteStorageState);
  const [useSyncWarnings, setUseSyncWarnings] = useRecoilState(useSyncWarningsState);
  const myBoxID = useRecoilValue(myBoxIDState);
  const myApiKey = useRecoilValue(myApiKeyState);
  const boxStatus = useRecoilValue(boxStatusState);
  const setReloadCards = useSetRecoilState(reloadCardsState);
  const [usingMyBox, setUsingMyBox] = useRecoilState(usingMyBoxState);
  const [copiedText, setCopiedText] = useState(null);
  const switchToMyBox = useSwitchToMyBox();
  const readOnlyBox = useRecoilValue(readOnlyBoxState);

  function handleToggleOnlineStorage() {
    setUseRemoteStorage((prev) => {
      const newValue = !prev;

      // if useRemoteStorage has been turned on, we need to delete cards stored locally
      // and recreate them remotely and vice versa if the user switches off useRemoteStorage.
      if (newValue) {
        recreateCardsRemotely();
      } else {
        recreateCardsLocally();
      }

      return newValue;
    });
  }

  function handleToggleSyncWarnings() {
    setUseSyncWarnings((prev) => !prev);
  }

  async function recreateCardsLocally() {
    // Load cards from the database
    const cards = await db.read({});

    // We will be deleting all remote cards at once and then recreating them locally.
    let cardsToCreate = [];
    for (let card of cards) {
      cardsToCreate.push({
        question: card.question,
        answer: card.answer,
        flipped: false,
        reads: card.reads,
        difficulty: card.difficulty,
      });
    }
    await db.delete(null, { remote: true });
    await db.create(cardsToCreate, { remote: false });

    // Reload the cards from the data store to update the view
    setReloadCards((prev) => prev + 1);
  }

  async function recreateCardsRemotely() {
    // Load cards from the database
    const cards = await db.read({});

    // We will be deleting all local cards at once and then recreating them
    // remotely.
    let cardsToCreate = [];
    for (let card of cards) {
      cardsToCreate.push({
        question: card.question,
        answer: card.answer,
        flipped: false,
        reads: card.reads,
        difficulty: card.difficulty,
      });
    }

    await db.delete(null, { remote: false });
    await db.create(cardsToCreate, { remote: true });

    // Reload the cards from the data store to update the view
    setReloadCards((prev) => prev + 1);
  }

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(
      () => {
        console.log("Async: Copying to clipboard was successful!");
        setCopiedText(text);
        setTimeout(() => setCopiedText(null), 1000);
      },
      (err) => {
        console.error("Async: Could not copy text: ", err);
      }
    );
  }

  return (
    <Panel heading="Online storage" color="blue">
      {!boxStatus && (
        <>
          <span className="error"> Problem with online storage</span>
          <br />
        </>
      )}

      {!readOnlyBox && (
        <div>
          <label className="switch">
            Toggle online storage
            <input
              type="checkbox"
              disabled={!boxStatus}
              onChange={handleToggleOnlineStorage}
              checked={useRemoteStorage}
            />
          </label>
          <br />
          <br />
        </div>
      )}

      {useRemoteStorage && (
        <>
          <label className="switch">
            Toggle sync warnings
            <input
              type="checkbox"
              disabled={!boxStatus}
              onChange={handleToggleSyncWarnings}
              checked={useSyncWarnings}
            />
            <br />
            <br />
          </label>

          <div>
            My storage box ID:
            <br />
            <strong>{myBoxID}</strong>{" "}
            <button
              className={copiedText === myBoxID ? "copied" : ""}
              onClick={() => copyToClipboard(myBoxID)}
            >
              copy
            </button>
            <br />
            <br />
            My storage box key:
            <br />
            <strong>{myApiKey}</strong>{" "}
            <button
              className={copiedText === myApiKey ? "copied" : ""}
              onClick={() => copyToClipboard(myApiKey)}
            >
              copy
            </button>
            <br />
            <br />
            <button onClick={() => setShowSwitchModal(true)} disabled={!boxStatus}>
              Switch to another storage box
            </button>
            <br />
            <br />
            {!usingMyBox && (
              <div>
                <button onClick={switchToMyBox} disabled={!boxStatus}>
                  Switch back to my storage box
                </button>
                <br />
                <br />
              </div>
            )}
          </div>
        </>
      )}
      {showSwitchModal && <Switch close={() => setShowSwitchModal(false)} />}
    </Panel>
  );
}

export default OnlineStoragePanel;
