import { useState } from "react";

import Panel from "../../Panel"
import Modal from "../../Modal";

import { db } from "../../../services/storage";

function YourDataPanel({ totalNumberOfCards }) {
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [showImportDataModal, setShowImportDataModal] = useState(false);
  const [fileError, setFileError] = useState(false);
  const [fileOK, setFileOK] = useState(false);
  const [file, setFile] = useState();

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

  function handleImportData(){
    setFileError(false);
    setFileOK(false);
    setShowImportDataModal(true);
  }

  function readFile(){
    // TODO: Check file is in correct format
    setFileOK(true);
  }

  function importData(){
    // TODO: Add the cards from the file data to the existing stack
    // Let user know that this will replace all cards
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
                <button onClick={deleteAllData}>Yes, delete everything</button> <br/><br/>
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
                {fileOK && (<button onClick={importData}>Add data</button>)}
              </div>
            </Modal>
           )}
      </Panel>
  );
}

export default YourDataPanel;