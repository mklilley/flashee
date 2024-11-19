import { useState } from "react";

import Modal from "../../../Modal";

function Switch({ close }) {
  const [switchBoxID, setSwitchBoxID] = useState("");
  const [switchApiKey, setSwitchApiKey] = useState("");
  const [switchBoxError, setSwitchBoxError] = useState("");
  const [canEdit, setCanEdit] = useState(false);

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      switchBox();
    }
  }

  function handleToggleCanEdit() {
    setSwitchApiKey("");
    setCanEdit((prev) => !prev);
  }

  async function switchBox(options = {}) {
    console.log("Testing switch flow", switchBoxID, switchApiKey);
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
