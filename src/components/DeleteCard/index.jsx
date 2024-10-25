import Modal from "../Modal";

import { useSetRecoilState, useRecoilValue } from 'recoil';
import { reloadCardsState, cardToDeleteState } from '@globalState';

import { db } from "../../services/storage";

function DeleteCard({ close }) {
  const setReloadCards = useSetRecoilState(reloadCardsState);
  const card = useRecoilValue(cardToDeleteState);

  async function deleteCard() {
    await db.delete(card.id, { remote: false });
    setReloadCards((prev) => prev + 1);
    close();
  }

  return (
    <Modal close={close}>
      <h2>Delete card</h2>
      <div className="purple">
        <button onClick={deleteCard}>Yes, delete card</button>
        <br />
        <br />
        <button onClick={close}>No, take me back</button>
      </div>
    </Modal>
  );
}

export default DeleteCard;
