import { useState } from "react";

import Modal from "../Modal";

import { db } from "../../services/storage";

import MathLive from "../MathLive";

// This component can be used to update an existing card of create a new card
function EditCard({ close, card, setReloadCards }) {
  const [question, setQuestion] = useState(card.question);
  const [answer, setAnswer] = useState(card.answer);
  const [showMathQuestion, setShowMathQuestion] = useState(false);
  const [showMathAnswer, setShowMathAnswer] = useState(false);

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
    setReloadCards((prev) => prev + 1);
    close();
  }

  function toggleMathQuestion() {
    setShowMathQuestion((prev) => !prev);
  }

  function toggleMathAnswer() {
    setShowMathAnswer((prev) => !prev);
  }

  function stripKatexDollars(text) {
    return text.replace(/^\$\$|\$\$$/g, "");
  }

  return (
    <Modal close={close}>
      <form className="flashcard-form misc" onSubmit={saveCard}>
        <input
          placeholder="Question"
          value={question}
          onChange={handleQuestionChange}
          required></input>
        <span className="math" onClick={toggleMathQuestion}>
          f(x)
        </span>

        <br />
        <br />
        <input
          placeholder="Answer"
          value={answer}
          onChange={handleAnswerChange}
          required></input>
        <span className="math" onClick={toggleMathAnswer}>
          f(x)
        </span>

        <br />
        <br />
        <button type="submit">Save Card</button>
      </form>
      {showMathAnswer && (
        <MathLive
          latex={stripKatexDollars(answer)}
          saveMath={setAnswer}
          close={toggleMathAnswer}
        />
      )}
      {showMathQuestion && (
        <MathLive
          latex={stripKatexDollars(question)}
          saveMath={setQuestion}
          close={toggleMathQuestion}
        />
      )}
    </Modal>
  );
}

export default EditCard;
