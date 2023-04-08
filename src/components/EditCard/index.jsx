import { useState } from "react";

import Modal from "../Modal";

import { db } from "../../services/storage";

// This component can be used to update an existing card of create a new card
function EditCard({ close, card }) {
  const [question, setQuestion] = useState(card.question);
  const [answer, setAnswer] = useState(card.answer);

  function handleQuestionChange(e) {
    setQuestion(e.target.value);
  }

  function handleAnswerChange(e) {
    setAnswer(e.target.value);
  }

  async function saveCard(e) {
    e.preventDefault();
    // If the card prop has an id, then this is an existing card that we are updating
    if (card.id) {
      await db.update(
        card.id,
        {
          question: question,
          answer: answer,
        },
        { remote: false }
      );
    }
    // If card prop has no id then this is a new card that needs to be created
    else {
      await db.create(
        [
          {
            question: question,
            answer: answer,
            flipped: false,
            reads: 0,
            difficulty: 0,
          },
        ],
        { remote: false }
      );
    }
    close();
  }
  return (
    <Modal close={close}>
      <form className="flashcard-form misc" onSubmit={saveCard}>
        <input
          placeholder="Question"
          value={question}
          onChange={handleQuestionChange}
          required></input>
        <input
          placeholder="Answer"
          value={answer}
          onChange={handleAnswerChange}
          required></input>
        <br />
        <br />
        <button type="submit">Save Card</button>
      </form>
    </Modal>
  );
}

export default EditCard;
