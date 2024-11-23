import { useState } from "react";

import { useSetRecoilState } from "recoil";
import { reloadCardsState, usingMyBoxState } from "@globalState";

import Modal from "../../../Modal";

import { db } from "../../../../services/storage";

function Switch({ close }) {
  const [switchBoxID, setSwitchBoxID] = useState("");
  const [switchApiKey, setSwitchApiKey] = useState("");
  const [switchBoxError, setSwitchBoxError] = useState("");
  const [canEdit, setCanEdit] = useState(false);
  const setReloadCards = useSetRecoilState(reloadCardsState);
  const setUsingMyBox = useSetRecoilState(usingMyBoxState);

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      switchBox();
    }
  }

  function handleToggleCanEdit() {
    setSwitchApiKey("");
    setCanEdit((prev) => !prev);
  }

  async function switchBox() {
    setSwitchBoxError("");

    // User has selected to have use an editable storage box but not given a key
    if (canEdit && !switchApiKey) {
      setSwitchBoxError("Error: Storage key must be a valid UUID.");
      return;
    }

    // Try to switch to new box. If the boxID isn't valid then we give user error message
    const switchedOK = await db
      .switch(switchBoxID.toLowerCase(), switchApiKey.toLowerCase())
      .catch((error) => {
        setSwitchBoxError(error.message);
      });

    if (switchedOK) {
      setSwitchBoxID("");
      setSwitchApiKey("");

      // After switching we need to restore the data from the remote source.
      // Pull the cards data from the remote database and save to local storage
      await db.read({ remote: true });
      // Load the cards into view
      setReloadCards((prev) => prev + 1);

      setUsingMyBox(false);

      close();
    }
  }

  return (
    <Modal close={close} color="blue">
      <h2>Switch box</h2>
      <input
        value={switchBoxID}
        onChange={(e) => setSwitchBoxID(e.target.value.trim())}
        onKeyDown={handleKeyDown}
        type="text"
        placeholder="New box ID"
      />{" "}
      <br />
      <br />
      <label className="switch">
        Do you want to edit these cards?
        <input type="checkbox" onChange={handleToggleCanEdit} checked={canEdit} />
      </label>
      {canEdit && (
        <input
          value={switchApiKey}
          onKeyDown={handleKeyDown}
          onChange={(e) => setSwitchApiKey(e.target.value.trim())}
          type="text"
          placeholder="New storage key"
        />
      )}
      <br />
      <br />
      <button onClick={switchBox}>Switch to new box</button>
      {switchBoxError && <span className="error">{switchBoxError}</span>}
    </Modal>
  );
}

export default Switch;
