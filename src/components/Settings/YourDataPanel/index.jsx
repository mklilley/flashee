import Panel from "../../Panel"

function YourDataPanel({ totalNumberOfCards }) {
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  function handleDeleteAllData(){
    setShowDeleteAllModal(true);
  }

  function deleteAllData(){
    console.log("deleting data");
    setShowDeleteAllModal(false);
  }

  async function downloadData(){
    //  Adapted from https://ourcodeworld.com/articles/read/189/how-to-create-a-file-and-generate-a-download-with-javascript-in-the-browser-without-a-server
    
    // Load cards from the database
    const cards = await db.read({});

    // Remove card data relating to how many times the card has been read, the difficulty, etc
    // and just retain the question and answer
    let dataForDownload = cards.map(function(card) {
      return { question: card.question, answer: card.answer };
    });

    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," +
        encodeURIComponent(JSON.stringify(dataForDownload))
    );
    element.setAttribute("download", "flashee.json");

    element.style.display = "none";
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }


  return (
      <Panel heading="Your data" color="yellow">
          Number of cards: <strong>{totalNumberOfCards}</strong> <br />
          <br />
          <div>
            <button onClick={downloadData}>Download your data</button>
            <br />
            <br />
          </div>
          <div>
            <button onClick={handleDeleteAllData}>Delete all your data</button>
            <br />
            <br />
          </div>
          <div>
            <button>Import data from file</button>
          </div>
          {showDeleteAllModal && (
            <Modal close={() => setShowDeleteAllModal(false)}>
              <div className="center">
                <h2>Delete all data</h2>
                <span className="error"> Problem with online storage. Only local data will be deleted.</span><br/>
                <button onClick={deleteAllData}>Yes, delete everything</button> <br/><br/>
                <button onClick={() => setShowDeleteAllModal(false)}>No, take me back</button>
              </div>
            </Modal>
           )}
      </Panel>
  );
}

export default YourDataPanel;
