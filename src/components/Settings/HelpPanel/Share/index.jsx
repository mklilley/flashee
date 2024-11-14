import Modal from "../../../Modal";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import { boxIDState, apiKeyState } from "@globalState";

function Share({ close }) {
  const boxID = useRecoilValue(boxIDState);
  const apiKey = useRecoilValue(apiKeyState);
  const [copiedText, setCopiedText] = useState(null);

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
    <Modal close={close} color="purple">
      <h2>Share</h2>
      To share your cards with others, give them your storage box ID:
      <br />
      <br />
      <strong>{boxID}</strong>{" "}
      <button
        className={copiedText === boxID ? "copied" : ""}
        onClick={() => copyToClipboard(boxID)}
      >
        Copy
      </button>
      <br />
      <br />
      They can then use the "Switch to another storage box" button in the "Online Storage" settings.
      This is best for those who already have Flashee installed.
      <br /> <br />
      Alternatively, anyone can see your cards via this link:
      <br /> <br />
      <strong>https://flashee.lilley.io?box={boxID}</strong>{" "}
      <button
        className={copiedText === `https://flashee.lilley.io?box=${boxID}` ? "copied" : ""}
        onClick={() => copyToClipboard(`https://flashee.lilley.io?box=${boxID}`)}
      >
        Copy
      </button>
      <br />
      <br />
      <button onClick={close}>OK</button>
    </Modal>
  );
}

export default Share;
