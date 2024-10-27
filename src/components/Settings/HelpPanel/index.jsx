import { useState } from "react";
import Panel from "../../Panel";
import Modal from "../../Modal";

import Feedback from "./Feedback";
import Share from "./Share";
import Reset from "./Reset";
import Welcome from "../../Welcome";


function HelpPanel() {
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);



  return (
    <Panel heading="Help" color="purple">
      <button onClick={() => setShowFeedbackModal(true)}>Send Feedback</button>
      <br />
      <br />
      <button onClick={() => setShowWelcomeModal(true)}>Show welcome screen again</button>
      <br />
      <br />
      <button onClick={() => setShowShareModal(true)}>Share my cards</button>
      <br />
      <br />
      <button onClick={() => setShowResetModal(true)}>Reset App</button> <br />
      <br />
      {showFeedbackModal && (<Feedback close={() => setShowFeedbackModal(false)} />)}
      {showWelcomeModal && (<Welcome close={() => setShowWelcomeModal(false)} />)}
      {showShareModal && (<Share close={() => setShowShareModal(false)} />)}
      {showResetModal && (<Reset close={() => setShowResetModal(false)} />)}
    </Panel>
  );
}

export default HelpPanel;
