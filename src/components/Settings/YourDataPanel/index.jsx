import Panel from "../../Panel"

function YourDataPanel({ totalNumberOfCards }) {

  return (
      <Panel heading="Your data" color="yellow">
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
      </Panel>
  );
}

export default YourDataPanel;
