import { useState } from "react";

import { useSetRecoilState } from "recoil";
import { reloadCardsState, usingMyBoxState } from "@globalState";

import Modal from "../Modal";

function Sync({ close, syncInfo }) {
  async function restoreData() {
    // this.cards = await this.loadCards({ remote: true });
    // localStorage.lastKeepAliveDate = new Date();
    close();
  }

  function ignoreSyncWarnings() {
    // this.showSyncWarnings = false;
    // localStorage.showSyncWarnings = false;
    // this.showSync = false;
  }

  return (
    <Modal close={close} color="purple">
      <h2>Warning</h2>
      Local storage is out of sync with online storage. {syncInfo} <br />
      <br />
      <button onClick={restoreData}>Restore data from online storage</button>
      <br />
      <br />
      <button onClick={ignoreSyncWarnings}>Ignore sync warnings</button>
    </Modal>
  );
}

export default Sync;
