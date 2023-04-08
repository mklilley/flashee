import styles from "./styles.module.css";
import { useState } from "react";

import { db } from "../../services/storage";

const Card = ({ card, handleEdit, handleDelete, handleRead }) => {
  const cardColor = { backgroundColor: card.color };

  const [flipped, setFlipped] = useState(false);

  function editCard(e) {
    // Need to stop propagation to prevent the card from flipping as soon as we hit the edit button
    e.stopPropagation();
    handleEdit(card);
  }

  async function flipCard(e) {
    // When the card is flipped back from answer to question, we treat the
    // card as being "read". We update the read value in the local data store.
    // We need to wait for 500ms for the card flip animation to almost complete before we do this.
    setFlipped((prev) => !prev);
    if (flipped) {
      setTimeout(async () => {
        // update read number on cards in storage
        await db.update(card.id, {
          reads: card.reads + 1,
        });

        handleRead(card);
      }, 500);
    }
  }

  function confirmDelete(e) {
    // Need to stop propagation to prevent the card from flipping as soon as we hit the delete button
    e.stopPropagation();
    handleDelete(card);
  }

  async function updateDifficulty(difficulty) {
    // Saves the new difficulty in storage
    await db.update(card.id, {
      difficulty: difficulty,
    });
  }

  return (
    <li onClick={flipCard} className={`${styles.card}`}>
      <div
        className={`${styles["flip-card-inner"]} ${
          flipped ? styles["flipped"] : ""
        }`}>
        <div className={styles["flip-card-front"]} style={cardColor}>
          <span>{card.question}</span>
        </div>
        <div className={styles["flip-card-back"]} style={cardColor}>
          <span className={styles["delete-card"]} onClick={confirmDelete}>
            <i className={styles["gg-trash"]}></i>
          </span>
          <span className={styles["edit-card"]} onClick={editCard}>
            <i className={styles["gg-pen"]}></i>
          </span>
          <span>{card.answer}</span>
          <span className={styles.difficulty}>
            <span onClick={(e) => updateDifficulty(1)}>hard</span>
            <span onClick={(e) => updateDifficulty(0)}>easy</span>
          </span>
        </div>
      </div>
    </li>
  );
};

export default Card;