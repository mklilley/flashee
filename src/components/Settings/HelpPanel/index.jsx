import { useState, useRef } from "react";
import Panel from "../../Panel";
import Modal from "../../Modal";


import ReCAPTCHA from 'react-google-recaptcha';


function HelpPanel({ children }) {
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [feedbackEmail, setFeedbackEmail] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [gRecaptchaResponse, setGRecaptchaResponse] = useState(null);
  const [sendFeedbackError, setSendFeedbackError] = useState(false);
  const [sendingFeedback, setSendingFeedback] = useState(false);

  const recaptchaRef = useRef();

  function handleFeedback() {
    setSendFeedbackError(false);
    setGRecaptchaResponse(null);
    setFeedbackEmail("");
    setFeedbackMessage("");
    setShowFeedbackModal(true);
  }

  function handleFeedbackEmailChange(e) {
    setFeedbackEmail(e.target.value);
  }

  function handleFeedbackMessageChange(e) {
    setFeedbackMessage(e.target.value);
  }

  async function sendFeedback() {
    setSendFeedbackError(false);

    let jsonForm = {};

    jsonForm.email = feedbackEmail;
    jsonForm.message = feedbackMessage;
    jsonForm["g-recaptcha-response"] = gRecaptchaResponse

    let options = {
      body: JSON.stringify(jsonForm),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    };

    setSendingFeedback(true);

    const response = await fetch(
      "https://formspree.io/f/xeqprbgl",
      options
    ).catch((err) => {
      this.error = true;
      console.log(err);
      handleCaptchaError();
      setSendingFeedback(false);
    });

    setSendingFeedback(false);

    if ((response || {}).ok) {
      setFeedbackEmail("");
      setFeedbackMessage("");
      showFeedbackModal(true);
    } else {
      setSendFeedbackError(true);
      handleCaptchaError();
    }

    return;
  }

  function handleCaptchaChange(recaptchaValue){
    if(recaptchaValue === null){
      // recaptcha expired so need to reset the form
      recaptchaRef.current.reset();
    }
    else{
      // If recaptcha callenge was successful then save the response
      setGRecaptchaResponse(recaptchaValue)
    }

  }

  function handleCaptchaError(){
    setGRecaptchaResponse(null)
    recaptchaRef.current.reset();
  }

  return (
    <Panel heading="Help" color="purple">
      <button onClick={handleFeedback}>Send Feedback</button>
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
      {showFeedbackModal && (
        <Modal close={() => setShowFeedbackModal(false)}>
            <h2>Feedback</h2>
            <form onSubmit={sendFeedback}>
              <input
                maxLength="10000"
                required
                onChange={handleFeedbackEmailChange}
                value={feedbackEmail}
                type="email"
                name="email"
                placeholder="Your email"
              />
              <br />
              <br />
              <textarea
                maxLength="10000"
                required
                onChange={handleFeedbackMessageChange}
                value={feedbackMessage}
                name="message"
                placeholder="Your message"></textarea>{" "}
              <br />
              <br />
              <ReCAPTCHA
        sitekey="6LfgCwoaAAAAAN6cSEf1nORFFicjw6STUtV3U4Em"
        onChange={handleCaptchaChange}
        onError={handleCaptchaError}
        ref={recaptchaRef}
      />
              {sendFeedbackError && (
                <span className="error">
                  Problem sending your feedback. Please check your internet
                  connection and try again.
                </span>
              )}
              <br />
              {gRecaptchaResponse && (
              <button  type="submit" className={sendingFeedback ? 'wait' : ''}>
              Send
            </button>
              )}

            </form>
        </Modal>
      )}
    </Panel>
  );
}

export default HelpPanel;
