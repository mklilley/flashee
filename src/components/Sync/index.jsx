import { useState } from "react";

import { useSetRecoilState, useRecoilValue } from "recoil";
import { useSyncWarningsState, totalNumberOfCardsState, reloadCardsState } from "@globalState";

import Modal from "../Modal";

import { db } from "../../services/storage";

function Sync({ close, boxStatus }) {
  const setUseSyncWarnings = useSetRecoilState(useSyncWarningsState);
  const totalNumberOfCards = useRecoilValue(totalNumberOfCardsState);
  const setReloadCards = useSetRecoilState(reloadCardsState);

  async function restoreData() {
    await db.read({ remote: true });
    setReloadCards((prev) => prev + 1);
    close();
  }

  function ignoreSyncWarnings() {
    setUseSyncWarnings(false);
    close();
  }

  return (
    <Modal close={close} color="purple">
      <h2>Warning</h2>
      Local storage is out of sync with online storage.{" "}
      {`Local cards: ${totalNumberOfCards}, Remote cards: ${boxStatus.numCards}.`} <br />
      <br />
      <button onClick={restoreData}>Restore data from online storage</button>
      <br />
      <br />
      <button onClick={ignoreSyncWarnings}>Ignore sync warnings</button>
    </Modal>
  );
}

export default Sync;
