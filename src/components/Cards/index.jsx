import React, { useState, useEffect, useCallback } from "react";

import { seedFunc as randomSeedFunc, sequence as randomSequence } from 'aimless.js'

import Card from "../Card";

import { db } from "../../services/storage";

import styles from "./styles.module.css";

const Cards = React.memo(({
  setShowEditModal,
  setCardToEdit,
  setShowDeleteModal,
  setCardToDelete,
  reloadCards,
  setTotalNumberOfCards,
  totalNumberOfCards,
  searchResults,
}) => {
  const [cards, setCards] = useState();

  // seed allows us to reshuffle cards if we want to
  const [seed, setSeed] = useState(Date.now());

  useEffect(() => {

    async function loadCards(options = {}) {
      let cards = await db.read(options);
      // After deck is shuffled, sort the array so that the least seen cards
      // come to the top of the list. This is to stop you from seeing the same
      // cards all the time
      cards = sortCards(shuffleCards(cards));
  
      // This is to give the TopBar awareness of the number of cards so that it can adjust its UI
      setTotalNumberOfCards(cards.length);
  
      // If we have searched for a card we need to filter the cards based on the results
      if (searchResults !== undefined) {
        cards = cards.filter((card) => {
          return searchResults.indexOf(card.id) > -1;
        });
      }
  
      setCards(cards);
    }

    loadCards();
    
  }, [seed, reloadCards, searchResults]);

  let searchBarVisible = false;



  function createCard() {
    setCardToEdit({ question: "", answer: "" });
    setShowEditModal((prev) => !prev);
  }

  const handleCardEdit = useCallback((card) => {
    setCardToEdit(card);
    setShowEditModal(true);
  }, []);

  const handleCardDelete = useCallback((card) => {
    setCardToDelete(card);
    setShowDeleteModal(true);
  }, []);

  const handleCardRead = useCallback(async (card) => {
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
    const colors = randomSequence(availableColors,randomSeedFunc(seed));
    return colors[i % availableColors.length];
  }

  function shuffleCards(cards) {
    const shuffledDeck = randomSequence(cards,randomSeedFunc(seed));

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

  /////// Rendering logic ////////
  if (cards === undefined) {
    // Cards haven't yet loaded so don't render anything
    return null;
  } else {
    if (totalNumberOfCards === 0) {
      // No cards exist - Give user the option to tap to create a new one
      return (
        <>
          <ul>
            <li>
              <p className={styles["no-card"]} onClick={createCard}>
                <span>No cards, tap to create one</span>
              </p>
            </li>
          </ul>
        </>
      );
    } else if (cards.length === 0) {
      // There are a non zero number of cards, but nothing in the cards array
      // This means there are no search results.
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
        </>
      );
    } else {
      // If there are cards then show them to the user
      return (
        <>
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
        </>
      );
    }
  }
});

export default Cards;
