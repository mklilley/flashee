import { useState } from "react";

import Panel from "../../Panel"
import Modal from "../../Modal";

import { db } from "../../../services/storage";

function YourDataPanel({ totalNumberOfCards, setReloadCards }) {
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [showImportDataModal, setShowImportDataModal] = useState(false);
  const [fileError, setFileError] = useState("");
  const [fileOK, setFileOK] = useState(false);
  const [file, setFile] = useState(null);
  const [deletingAll, setDeletingAll] = useState(false);
  const [importingData, setImportingData] = useState(false);

  function handleDeleteAllData(){
    setShowDeleteAllModal(true);
  }

  async function deleteAllData(){
    // Delete button shows wait icon while delete all is happening
    setDeletingAll(true);

    // Actually do the delete all
    await db.delete(null, { remote: false });

    // Trigger the app to reload the cards (which should now be empty)
    setReloadCards((prev) => prev + 1);

    // Remove the waiting icon
    setDeletingAll(false);

    // Hide the delete all modal
    setShowDeleteAllModal(false)
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

  function handleImportData(){
    setFileError(false);
    setFileOK(false);
    setShowImportDataModal(true);
  }

  function readFile(event) {
    setFileOK(false);
    setFileError("");
  
    let file = event.target.files[0];
    if (file) {
      let reader = new FileReader();
  
      reader.readAsText(file);
  
      reader.onload = () => {
        try {
          const parsedFile = JSON.parse(reader.result);
          if (!Array.isArray(parsedFile)) {
            throw new Error("Data not in array format");
          }
          setFile(parsedFile); // Set the parsed file state
          setFileOK(true); // Indicate successful file read
        } catch (error) {
          setFileError(
            'Error: File must contain a list of questions and answers in the form [{"question":"2x2", "answer":"4"},{...},...]'
          );
          setFileOK(false); // Reset fileOK if parsing fails
        }
      };
  
      reader.onerror = () => {
        setFileError(reader.error);
        setFileOK(false); // Reset fileOK on read error
      };
    }
  }

  async function importData(){
    let cardsToCreate = [];
    // let reads = this.cards[0] ? this.cards[0].reads : 0;
    for (let card of file) {
      cardsToCreate.push(
          {
            question: card.question,
            answer: card.answer,
            flipped: false,
            reads: 0,
            difficulty: 0,
          }
      );
    }
    console.log(cardsToCreate)

    // Show the waiting icon on the add data button while we wait for data to be added
    setImportingData(true);

    // Add the cards to the database
    await db.create(cardsToCreate, { remote: false });

    // Trigger the app to reload the cards which should now included the newly imported ones
    setReloadCards((prev) => prev + 1);

    // Stop showing the waiting icon on the add data button
    setImportingData(false);

    // Close the Import data modal
    setShowImportDataModal(false);
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
            <button onClick={handleImportData}>Import data from file</button>
          </div>
          {showDeleteAllModal && (
            <Modal close={() => setShowDeleteAllModal(false)}>
              <div className="center">
                <h2>Delete all data</h2>
                <span className="error"> Problem with online storage. Only local data will be deleted.</span><br/>
                <button onClick={deleteAllData} className={deletingAll ? 'wait' : ''}>Yes, delete everything</button> <br/><br/>
                <button onClick={() => setShowDeleteAllModal(false)}>No, take me back</button>
              </div>
            </Modal>
           )}
          {showImportDataModal && (
            <Modal close={() => setShowImportDataModal(false)}>
              <div className="center">
                <h2>Add data from file</h2>
                <input type="file" onChange={readFile}/> <br/><br/>
                {fileError && (<span className="error">{fileError}</span>)}
                {fileOK && (<button onClick={importData} className={importingData ? 'wait' : ''}>Add data</button>)}
              </div>
            </Modal>
           )}
      </Panel>
  );
}

export default YourDataPanel;