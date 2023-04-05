import { useState, useEffect, useCallback } from "react";
import * as shuffleSeed from "shuffle-seed";

import Card from "../Card";
import EditCard from "../EditCard";
import DeleteCard from "../DeleteCard";

import { db } from "../../services/storage";

import styles from "./styles.module.css";

const Cards = () => {
  const [cards, setCards] = useState([]);

  // This is for the edit card modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [cardToEdit, setCardToEdit] = useState({});

  // This is for the delete card modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [cardToDelete, setCardToDelete] = useState({});

  // seed allows us to reshuffle cards if we want to
  const [seed, setSeed] = useState(Date.now());

  useEffect(() => {
    loadCards();
  }, [seed]);

  let searchBarVisible = false;

  async function loadCards(options = {}) {
    let cards = await db.read(options);
    // After deck is shuffled, sort the array so that the least seen cards
    // come to the top of the list. This is to stop you from seeing the same
    // cards all the time
    cards = sortCards(shuffleCards(cards));
    setCards(cards);
  }

  async function createCard() {
    setCardToEdit({ question: "", answer: "" });
    setShowEditModal((prev) => !prev);
  }

  const handleCardEdit = useCallback((card) => {
    setCardToEdit(card);
    setShowEditModal((prev) => !prev);
  }, []);

  const handleCloseCardEdit = useCallback(() => {
    setShowEditModal((prev) => !prev);
    loadCards();
  }, []);

  const handleCardDelete = useCallback((card) => {
    setCardToDelete(card);
    setShowDeleteModal((prev) => !prev);
  }, []);

  const handleCloseCardDelete = useCallback((card) => {
    setShowDeleteModal((prev) => !prev);
    loadCards();
  }, []);

  const handleCardRead = useCallback(async (card) => {
    // A card that's been flipped back from answer to question gets its "read" property updated in local storage.
    // This means we need to load the cards from storage into the component again
    await loadCards();

    // We want to make sure that the card that was just flipped back ends up at the end of the pile of cards
    setCards((prevCards) => {
      let cards = [...prevCards];
      const flippedCardArrayIndex = cards.findIndex((e) => e.id == card.id);
      const updatedFlippedCard = cards.splice(flippedCardArrayIndex, 1);
      cards.push(updatedFlippedCard[0]);
      return cards;
    });
  }, []);

  function randomColor(i) {
    const availableColors = [
      "#51aae5",
      "#e65f51",
      "#a17de9",
      "#feca34",
      "#e46055",
    ];
    const colors = shuffleSeed.shuffle(availableColors, seed);
    return colors[i % availableColors.length];
  }

  function shuffleCards(cards) {
    const shuffledDeck = shuffleSeed.shuffle(cards, seed);

    for (let i = 0; i < shuffledDeck.length; i++) {
      shuffledDeck[i].color = randomColor(i);
    }

    return shuffledDeck;
  }

  function sortCards(cards) {
    let sortByReads = cards.sort(function (a, b) {
      return parseFloat(a.reads) - parseFloat(b.reads);
    });

    let sortByDifficulty = sortByReads.sort(function (a, b) {
      return parseFloat(b.difficulty) - parseFloat(a.difficulty);
    });

    return sortByDifficulty;
  }

  if (cards.length === 0) {
    if (searchBarVisible) {
      // No cards and search box visible just means there are no search results.
      // Don't give user option to tap to create a new card.
      return (
        <>
          <ul>
            <li>
              <p className={styles["no-card"]}>
                <span>Nothing, sorry 😢</span>
              </p>
            </li>
          </ul>
          {showEditModal && (
            <EditCard card={cardToEdit} close={handleCloseCardEdit}></EditCard>
          )}
        </>
      );
    } else {
      // No cards with no search box visible means there are really no cards
      // Give user the option to tap to create a new one
      return (
        <>
          <ul>
            <li>
              <p className={styles["no-card"]} onClick={createCard}>
                <span>No cards, tap to create one</span>
              </p>
            </li>
          </ul>
          {showEditModal && (
            <EditCard card={cardToEdit} close={handleCloseCardEdit}></EditCard>
          )}
        </>
      );
    }
  } else {
    // If there are cards then show them to the user
    return (
      <>
        <button onClick={createCard}>Create</button>
        <ul>
          {cards.map((card) => (
            <Card
              key={card.id}
              card={card}
              handleDelete={handleCardDelete}
              handleEdit={handleCardEdit}
              handleRead={handleCardRead}></Card>
          ))}
        </ul>
        {showEditModal && (
          <EditCard card={cardToEdit} close={handleCloseCardEdit}></EditCard>
        )}
        {showDeleteModal && (
          <DeleteCard
            card={cardToDelete}
            close={handleCloseCardDelete}></DeleteCard>
        )}
      </>
    );
  }
};

export default Cards;
