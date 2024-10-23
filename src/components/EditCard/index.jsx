import { useState } from "react";
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { minReadsState, reloadCardsState } from '@globalState';

import Modal from "../Modal";

import { db } from "../../services/storage";

import MathLive from "../MathLive";

// This component can be used to update an existing card of create a new card
function EditCard({ close, card }) {
  const [question, setQuestion] = useState(card.question);
  const [answer, setAnswer] = useState(card.answer);
  const [showMathQuestion, setShowMathQuestion] = useState(false);
  const [showMathAnswer, setShowMathAnswer] = useState(false);
  const minReads = useRecoilValue(minReadsState);
  const setReloadCards = useSetRecoilState(reloadCardsState);

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
            reads: minReads,
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
    <Modal close={close} color="purple">
      <form className="edit-flashcard" onSubmit={saveCard}>
        <input
          placeholder="Question"
          value={question}
          onChange={handleQuestionChange}
          required></input>
        <span className="math" onClick={toggleMathQuestion}>
        <svg xmlns="http://www.w3.org/2000/svg" style={{ width: '21px' }} viewBox="0 0 576 512" role="img" aria-label="Toggle Virtual Keyboard"><path d="M528 64H48C21.49 64 0 85.49 0 112v288c0 26.51 21.49 48 48 48h480c26.51 0 48-21.49 48-48V112c0-26.51-21.49-48-48-48zm16 336c0 8.823-7.177 16-16 16H48c-8.823 0-16-7.177-16-16V112c0-8.823 7.177-16 16-16h480c8.823 0 16 7.177 16 16v288zM168 268v-24c0-6.627-5.373-12-12-12h-24c-6.627 0-12 5.373-12 12v24c0 6.627 5.373 12 12 12h24c6.627 0 12-5.373 12-12zm96 0v-24c0-6.627-5.373-12-12-12h-24c-6.627 0-12 5.373-12 12v24c0 6.627 5.373 12 12 12h24c6.627 0 12-5.373 12-12zm96 0v-24c0-6.627-5.373-12-12-12h-24c-6.627 0-12 5.373-12 12v24c0 6.627 5.373 12 12 12h24c6.627 0 12-5.373 12-12zm96 0v-24c0-6.627-5.373-12-12-12h-24c-6.627 0-12 5.373-12 12v24c0 6.627 5.373 12 12 12h24c6.627 0 12-5.373 12-12zm-336 80v-24c0-6.627-5.373-12-12-12H84c-6.627 0-12 5.373-12 12v24c0 6.627 5.373 12 12 12h24c6.627 0 12-5.373 12-12zm384 0v-24c0-6.627-5.373-12-12-12h-24c-6.627 0-12 5.373-12 12v24c0 6.627 5.373 12 12 12h24c6.627 0 12-5.373 12-12zM120 188v-24c0-6.627-5.373-12-12-12H84c-6.627 0-12 5.373-12 12v24c0 6.627 5.373 12 12 12h24c6.627 0 12-5.373 12-12zm96 0v-24c0-6.627-5.373-12-12-12h-24c-6.627 0-12 5.373-12 12v24c0 6.627 5.373 12 12 12h24c6.627 0 12-5.373 12-12zm96 0v-24c0-6.627-5.373-12-12-12h-24c-6.627 0-12 5.373-12 12v24c0 6.627 5.373 12 12 12h24c6.627 0 12-5.373 12-12zm96 0v-24c0-6.627-5.373-12-12-12h-24c-6.627 0-12 5.373-12 12v24c0 6.627 5.373 12 12 12h24c6.627 0 12-5.373 12-12zm96 0v-24c0-6.627-5.373-12-12-12h-24c-6.627 0-12 5.373-12 12v24c0 6.627 5.373 12 12 12h24c6.627 0 12-5.373 12-12zm-96 152v-8c0-6.627-5.373-12-12-12H180c-6.627 0-12 5.373-12 12v8c0 6.627 5.373 12 12 12h216c6.627 0 12-5.373 12-12z"></path></svg>
        </span>

        <br />
        <br />
        <input
          placeholder="Answer"
          value={answer}
          onChange={handleAnswerChange}
          required></input>
        <span className="math" onClick={toggleMathAnswer}>
        <svg xmlns="http://www.w3.org/2000/svg" style={{ width: '21px' }} viewBox="0 0 576 512" role="img" aria-label="Toggle Virtual Keyboard"><path d="M528 64H48C21.49 64 0 85.49 0 112v288c0 26.51 21.49 48 48 48h480c26.51 0 48-21.49 48-48V112c0-26.51-21.49-48-48-48zm16 336c0 8.823-7.177 16-16 16H48c-8.823 0-16-7.177-16-16V112c0-8.823 7.177-16 16-16h480c8.823 0 16 7.177 16 16v288zM168 268v-24c0-6.627-5.373-12-12-12h-24c-6.627 0-12 5.373-12 12v24c0 6.627 5.373 12 12 12h24c6.627 0 12-5.373 12-12zm96 0v-24c0-6.627-5.373-12-12-12h-24c-6.627 0-12 5.373-12 12v24c0 6.627 5.373 12 12 12h24c6.627 0 12-5.373 12-12zm96 0v-24c0-6.627-5.373-12-12-12h-24c-6.627 0-12 5.373-12 12v24c0 6.627 5.373 12 12 12h24c6.627 0 12-5.373 12-12zm96 0v-24c0-6.627-5.373-12-12-12h-24c-6.627 0-12 5.373-12 12v24c0 6.627 5.373 12 12 12h24c6.627 0 12-5.373 12-12zm-336 80v-24c0-6.627-5.373-12-12-12H84c-6.627 0-12 5.373-12 12v24c0 6.627 5.373 12 12 12h24c6.627 0 12-5.373 12-12zm384 0v-24c0-6.627-5.373-12-12-12h-24c-6.627 0-12 5.373-12 12v24c0 6.627 5.373 12 12 12h24c6.627 0 12-5.373 12-12zM120 188v-24c0-6.627-5.373-12-12-12H84c-6.627 0-12 5.373-12 12v24c0 6.627 5.373 12 12 12h24c6.627 0 12-5.373 12-12zm96 0v-24c0-6.627-5.373-12-12-12h-24c-6.627 0-12 5.373-12 12v24c0 6.627 5.373 12 12 12h24c6.627 0 12-5.373 12-12zm96 0v-24c0-6.627-5.373-12-12-12h-24c-6.627 0-12 5.373-12 12v24c0 6.627 5.373 12 12 12h24c6.627 0 12-5.373 12-12zm96 0v-24c0-6.627-5.373-12-12-12h-24c-6.627 0-12 5.373-12 12v24c0 6.627 5.373 12 12 12h24c6.627 0 12-5.373 12-12zm96 0v-24c0-6.627-5.373-12-12-12h-24c-6.627 0-12 5.373-12 12v24c0 6.627 5.373 12 12 12h24c6.627 0 12-5.373 12-12zm-96 152v-8c0-6.627-5.373-12-12-12H180c-6.627 0-12 5.373-12 12v8c0 6.627 5.373 12 12 12h216c6.627 0 12-5.373 12-12z"></path></svg>
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
