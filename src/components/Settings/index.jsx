import Modal from "../Modal";

// import { db } from "../../services/storage";

function Settings({ close, totalNumberOfCards }) {
  return (
    <Modal close={close}>
      <div className="settings">
        <h2> Settings </h2>
        <div className="left">
          <div className="your-data">
            <h3>Your data</h3>
            <div className="items">
              Number of cards: <strong>{totalNumberOfCards}</strong> <br />
              <br />
              <div>
                <button>Download your data</button>
                <br />
                <br />
              </div>
              <div>
                <button>Delete all your data</button>
                <br />
                <br />
              </div>
              <div>
                <button>Import data from file</button>
              </div>
            </div>
          </div>
          <br />

          <div className="online-storage ">
            <h3>Online storage</h3>
            <div className="items">
              <span className="error"> Problem with online storage</span>
              <br />
              <div>
                <label className="switch">
                  Toggle online storage
                  <input type="checkbox" />
                  <span className="slider round"></span>
                </label>
                <br />
                <br />
              </div>

              <label className="switch">
                Toggle sync warnings
                <input type="checkbox" />
                <span className="slider round"></span>
                <br />
                <br />
              </label>

              <div>
                My storage box ID:
                <br />
                <strong>boxID</strong> <button>copy</button>
                <br />
                <br />
                My storage box key:
                <br />
                <strong>apiKey</strong> <button>copy</button>
                <br />
                <br />
                <button>Switch to another storage box</button>
                <br />
                <br />
                <div>
                  <button>Switch back to my storage box</button>
                  <br />
                  <br />
                </div>
              </div>
            </div>
          </div>
          <br />

          <div className="misc ">
            <h3>Help</h3>
            <div className="items">
              <button>Send Feedback</button>
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
            </div>
          </div>
        </div>
        <br />
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
      </div>
    </Modal>
  );
}

export default Settings;
