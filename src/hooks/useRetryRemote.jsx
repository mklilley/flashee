import { useSetRecoilState } from "recoil";
import { reloadCardsState } from "@globalState";

import { db } from "../services/storage";

export const useRetryRemote = () => {
  const setReloadCards = useSetRecoilState(reloadCardsState);

  return async () => {
    // Retrieve the list of failed operations from local storage
    const remoteFails = JSON.parse(localStorage.getItem("remoteFails")) || [];

    if (remoteFails.length === 0) {
      console.log("No failed operations to retry.");
      return;
    }

    // Track successfully retried operations
    const removeRetries = [];

    // Iterate through each failed operation
    for (const fail of remoteFails) {
      try {
        // Retrieve all cards from local storage
        const allCards = JSON.parse(localStorage.getItem("cards")) || {};
        if (fail.type === "create") {
          // For "create", find the card data by ID and retry the create operation
          const cardData = allCards[fail.id];
          if (cardData) {
            const success = await db.create(
              [
                {
                  question: cardData.question,
                  answer: cardData.answer,
                  flipped: false,
                  reads: cardData.reads,
                  difficulty: cardData.difficulty,
                },
              ],
              { remote: true, retry: true }
            );
            // If successful then delete the locally created card that was made when the remote
            // failed
            if (success) {
              console.log(`Successfully retried 'create' for card ID: ${fail.id}`);
              const didDelete = await db.delete(fail.id, { remote: false });
              if (didDelete) {
                console.log(`Deleted locally created card with ID: ${fail.id}`);
              }
              removeRetries.push(fail);
            } else {
              console.log(`Failed retried 'create' for card ID: ${fail.id}`);
            }
          } else {
            console.warn(`Card data not found for 'create' operation with ID: ${fail.id}`);
            removeRetries.push(fail);
          }
        } else if (fail.type === "update") {
          // For "update", find the card data by ID and retry the update operation
          const cardData = allCards[fail.id];
          if (cardData) {
            const success = await db.update(fail.id, cardData, { remote: true, retry: true });
            if (success) {
              console.log(`Successfully retried 'update' for card ID: ${fail.id}`);
              removeRetries.push(fail);
            } else {
              console.log(`Failed retried 'update' for card ID: ${fail.id}`);
            }
          } else {
            console.warn(`Card data not found for 'update' operation with ID: ${fail.id}`);
            removeRetries.push(fail);
          }
        } else if (fail.type === "delete") {
          // For "delete", retry the delete operation
          if (fail.id === "all") {
            const success = await db.delete(undefined, { remote: true, retry: true });
            if (success) {
              console.log("Successfully retried 'delete' for all cards.");
              removeRetries.push(fail);
            } else {
              console.log("Failed retried 'delete' for all cards.");
            }
          } else {
            const success = await db.delete(fail.id, { remote: true, retry: true });
            if (success) {
              console.log(`Successfully retried 'delete' for card ID: ${fail.id}`);
              removeRetries.push(fail);
            } else {
              console.log(`Failed retried 'delete' for card ID: ${fail.id}`);
            }
          }
        }
      } catch (error) {
        console.error(`Failed to retry '${fail.type}' for card ID: ${fail.id}`, error);
      }
    }

    // Remove successfully retried operations from remoteFails
    const updatedFails = remoteFails.filter((fail) => !removeRetries.includes(fail));

    localStorage.setItem("remoteFails", JSON.stringify(updatedFails));

    setReloadCards((prev) => prev + 1);
  };
};
