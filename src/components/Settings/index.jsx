import { Suspense } from "react";
import Modal from "../Modal";

import YourDataPanel from "./YourDataPanel";
import OnlineStoragePanel from "./OnlineStoragePanel";
import HelpPanel from "./HelpPanel";

// import { db } from "../../services/storage";

function Settings({ close }) {
  return (
    <Modal close={close}>
      <h2> Settings </h2>
      <div className="left">
        <Suspense fallback={<div>Loading...</div>}>
          <YourDataPanel></YourDataPanel>
        </Suspense>
        <br />
        <Suspense fallback={<div>Loading...</div>}>
          <OnlineStoragePanel></OnlineStoragePanel>
        </Suspense>
        <br />
        <HelpPanel></HelpPanel>
        <br />
      </div>
      <br />
      <a href="https://www.buymeacoffee.com/mklilley" target="_blank" rel="noopener">
        <img
          src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
          alt="Buy Me A Coffee"
          className="coffee"
        />
      </a>{" "}
      <br />
      <br />
    </Modal>
  );
}

export default Settings;
