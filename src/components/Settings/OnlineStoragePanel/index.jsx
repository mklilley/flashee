import Panel from "../../Panel";

import { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { useRemoteStorageState, boxIDState, apiKeyState, boxStatusState } from "@globalState";

function OnlineStoragePanel() {
  const [useRemoteStorage, setUseRemoteStorage] = useRecoilState(useRemoteStorageState);
  const boxID = useRecoilValue(boxIDState);
  const apiKey = useRecoilValue(apiKeyState);
  const boxStatus = useRecoilValue(boxStatusState);

  function handleToggleOnlineStorage() {
    setUseRemoteStorage((prev) => !prev);
  }

  return (
    <Panel heading="Online storage" color="blue">
      {!boxStatus && (
        <>
          <span className="error"> Problem with online storage</span>
          <br />
        </>
      )}

      <div>
        <label className="switch">
          Toggle online storage
          <input
            type="checkbox"
            disabled={!boxStatus}
            onChange={handleToggleOnlineStorage}
            checked={useRemoteStorage}
          />
          <span className="slider round"></span>
        </label>
        <br />
        <br />
      </div>

      {useRemoteStorage && (
        <>
          <label className="switch">
            Toggle sync warnings
            <input disabled={!boxStatus} type="checkbox" />
            <span className="slider round"></span>
            <br />
            <br />
          </label>

          <div>
            My storage box ID:
            <br />
            <strong>{boxID}</strong> <button>copy</button>
            <br />
            <br />
            My storage box key:
            <br />
            <strong>{apiKey}</strong> <button>copy</button>
            <br />
            <br />
            <button disabled={!boxStatus}>Switch to another storage box</button>
            <br />
            <br />
            <div>
              <button disabled={!boxStatus}>Switch back to my storage box</button>
              <br />
              <br />
            </div>
          </div>
        </>
      )}
    </Panel>
  );
}

export default OnlineStoragePanel;
