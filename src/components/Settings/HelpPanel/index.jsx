import Panel from "../../Panel"

function HelpPanel({ children }) {

  return (
      <Panel heading="Help" color="purple">
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
      </Panel>
  );
}

export default HelpPanel;
