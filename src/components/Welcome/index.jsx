import { useState, useLayoutEffect } from "react";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { haveSeenWelcomeState, useRemoteStorageState, boxIDState, apiKeyState } from "@globalState";

import Modal from "../Modal";
import Panel from "../Panel";

import logo from "../../assets/logo.svg";
import githubOctocat from "../../assets/github.png";

function Welcome({ close }) {
  const boxID = useRecoilValue(boxIDState);
  const apiKey = useRecoilValue(apiKeyState);
  const [isMobileDevice, setIsMobileDevice] = useState(true);
  const [addToHomeScreenURL, setAddToHomeScreenURL] = useState("");
  const [copiedText, setCopiedText] = useState(null);
  const setHaveSeenWelcome = useSetRecoilState(haveSeenWelcomeState);
  const useRemoteStorage = useRecoilValue(useRemoteStorageState);

  useLayoutEffect(() => {
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    ) {
      setIsMobileDevice(true);
      if (/Android/i.test(navigator.userAgent)) {
        setAddToHomeScreenURL(
          "https://browserhow.com/how-to-add-to-home-screen-shortcut-links-with-chrome-android/"
        );
      }
      if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        setAddToHomeScreenURL(
          "https://www.macrumors.com/how-to/add-a-web-link-to-home-screen-iphone-ipad/"
        );
      }
    } else {
      setIsMobileDevice(false);
    }
  }, []);

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

  function closeWelcome() {
    setHaveSeenWelcome(true);
    close();
  }

  return (
    <Modal close={close} color="purple">
      <h1>
        <img src={logo} alt="Flashee logo" />
        <br />
        Flashee
      </h1>
      <h2>The free & simple flash card app</h2>
      <a href="https://www.buymeacoffee.com/mklilley" target="_blank" rel="noopener">
        <img
          src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
          alt="Buy Me A Coffee"
          className="coffee"
        />
      </a>{" "}
      <br />
      <br />
      <div className="left">
        <Panel heading="The story">
          I built a basic version of Flashee in the Christmas holidays of 2018. The idea was to help
          me remember physics facts. Since then, I've enjoyed using it every day as part of my
          casual physics morning routine 🤓 . I thought other people might also find it useful, so
          in the Christmas of 2020 I decided to clean it up and make it available to everyone for
          free. You can find the source code on{" "}
          <a target="_blank" href="https://github.com/mklilley/flashee" rel="noopener">
            GitHub <img src={githubOctocat} height="20" alt="GitHub logo" />
          </a>
          . Enjoy!
        </Panel>
        <br />
        {isMobileDevice && (
          <>
            <Panel heading="Add to home screen" color="purple">
              For the best experience, add Flashee to your home screen - you can then view your
              cards in full screen mode 🙌.{" "}
              <a target="_blank" rel="noopener" href={addToHomeScreenURL}>
                Here's help on how to do that.
              </a>
            </Panel>
            <br />
          </>
        )}
        <Panel heading="Local data storage" color="purple">
          Your flash cards are stored on your device using your browser's{" "}
          <a
            href="https://blog.logrocket.com/the-complete-guide-to-using-localstorage-in-javascript-apps-ba44edb53a36/."
            target="_blank"
            rel="noopener"
          >
            localStorage
          </a>
          .
        </Panel>
        <br />

        <Panel heading="Online data storage" color="purple">
          {useRemoteStorage ? (
            <span>
              Your flash cards will also be backed up in an online storage "box" for free (you can
              turn this off in settings).
              <br />
              <br />
              If you don't use the app for a year, however, your data will be deleted. <br />
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
              <button
                className={copiedText === `boxID: ${boxID} \nstorageKey: ${apiKey}` ? "copied" : ""}
                onClick={() => copyToClipboard(`boxID: ${boxID} \nstorageKey: ${apiKey}`)}
              >
                Copy your box ID and key
              </button>{" "}
              and keep them safe - anyone with your box ID can view your data and anyone with your
              key can edit and delete your data. <br />
              <br />
              There is no backup of the online data, so if your data is lost due to some technical
              issues, it's lost forever.
              <br />
              <br />
              Please don't use this app to store sensitive information - it's not been stress tested
              for data security bugs.
              <br />
              <br />
            </span>
          ) : (
            <span>Currently disabled in settings</span>
          )}
        </Panel>
        <br />
      </div>
      <button onClick={closeWelcome}>OK</button>
      <p style={{ marginTop: 0 }}>(don't show again)</p>{" "}
    </Modal>
  );
}

export default Welcome;
