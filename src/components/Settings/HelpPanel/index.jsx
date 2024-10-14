import { useState } from "react";
import Panel from "../../Panel";
import Modal from "../../Modal";

import Feedback from "./Feedback"


function HelpPanel({ children }) {
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);


  return (
    <Panel heading="Help" color="purple">
      <button onClick={() => setShowFeedbackModal(true)}>Send Feedback</button>
      <br />
      <br />
      <button>Show welcome screen again</button>
      <br />
      <br />
      <div>
        <button>Share my cards</button>
        <br />
        <br />
      </div>
      <button>Reset App</button> <br />
      <br />
      {showFeedbackModal && (<Feedback  close={() => setShowFeedbackModal(false)} />)}
    </Panel>
  );
}

export default HelpPanel;
