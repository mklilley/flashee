import Modal from "../../../Modal";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import { myBoxIDState } from "@globalState";

function Share({ close }) {
  const myBoxID = useRecoilValue(myBoxIDState);
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
      <strong>{myBoxID}</strong>{" "}
      <button
        className={copiedText === myBoxID ? "copied" : ""}
        onClick={() => copyToClipboard(myBoxID)}
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
      <strong>https://flashee.lilley.io?box={myBoxID}</strong>{" "}
      <button
        className={copiedText === `https://flashee.lilley.io?box=${myBoxID}` ? "copied" : ""}
        onClick={() => copyToClipboard(`https://flashee.lilley.io?box=${myBoxID}`)}
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
