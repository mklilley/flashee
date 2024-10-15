import { useState } from "react";

import Modal from "../Modal";
import Panel from "../Panel";

import logo from "../../assets/logo.svg";
import githubOctocat from "../../assets/github.png";

function Welcome({ close }) {
  const [boxID, setBoxID] = useState("1234");
  const [apiKey, setApiKey] = useState("1234");
  const [useRemoteStorage, setUseRemoteStorage] = useState(false);

  function closeWelcome() {
    // TODO: Send this to a global storage service to handle
    localStorage.setItem("haveSeenWelcome", true);
    close();
  }

  return (
    <Modal close={close}>
      <h1>
        <img src={logo} alt="Flashee logo" />
        <br />
        Flashee
      </h1>
      <h2>The free & simple flash card app</h2>
      <a
        href="https://www.buymeacoffee.com/mklilley"
        target="_blank"
        rel="noopener">
        <img
          src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
          alt="Buy Me A Coffee"
          className="coffee"
        />
      </a>{" "}
      <br />
      <br />
      <div className="left">
        <Panel heading="The story" color="purple">
          I built a basic version of Flashee in the Christmas holidays of 2018.
          The idea was to help me remember physics facts. Since then, I've
          enjoyed using it every day as part of my casual physics morning
          routine 🤓 . I thought other people might also find it useful, so in
          the Christmas of 2020 I decided to clean it up and make it available
          to everyone for free. You can find the source code on{" "}
          <a
            target="_blank"
            href="https://github.com/mklilley/flashee"
            rel="noopener">
            GitHub <img src={githubOctocat} height="20" alt="GitHub logo" />
          </a>
          . Enjoy!
        </Panel>
        <br />
        <Panel heading="Add to home screen" color="purple">
          For the best experience, add Flashee to your home screen - you can
          then view your cards in full screen mode 🙌.{" "}
          <a
            vue-if="addToHomeScreenURL"
            target="_blank"
            rel="noopener"
            href="addToHomeScreenURL">
            Here's help on how to do that.
          </a>
        </Panel>
        <br />

        <Panel heading="Local data storage" color="purple">
          Your flash cards are stored on your device using your browser's{" "}
          <a
            href="https://blog.logrocket.com/the-complete-guide-to-using-localstorage-in-javascript-apps-ba44edb53a36/."
            target="_blank"
            rel="noopener">
            localStorage
          </a>
          .
        </Panel>
        <br />

        <Panel heading="Online data storage" color="purple">
          {useRemoteStorage ? (
            <span v-if="useRemoteStorage">
              Your flash cards will also be backed up in an online storage "box"
              for free (you can turn this off in settings).
              <br />
              <br />
              If you don't use the app for a year, however, your data will be
              deleted. <br />
              <br />
              Here is your storage box ID:
              <br />
              <br />
              <strong>{boxID}</strong> <br />
              <br />
              Here is your personal storage key:
              <br />
              <br />
              <strong>{apiKey}</strong> <br />
              <br />
              <button>Copy your box ID and key</button> and keep them safe -
              anyone with your box ID can view your data and anyone with your
              key can edit and delete your data. <br />
              <br />
              There is no backup of the online data, so if your data is lost due
              to some technical issues, it's lost forever.
              <br />
              <br />
              Please don't use this app to store sensitive information - it's
              not been stress tested for data security bugs.
              <br />
              <br />
            </span>
          ) : (
            <span v-else>Currently disabled in settings</span>
          )}
        </Panel>
        <br />
      </div>
      <button onClick={closeWelcome}>OK</button>
    </Modal>
  );
}

export default Welcome;
