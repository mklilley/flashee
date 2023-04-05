import Modal from "../Modal";

import { db } from "../../services/storage";

function DeleteCard({ close, card }) {
  async function deleteCard() {
    await db.delete(card.id, { remote: false });
    close();
  }

  return (
    <Modal close={close}>
      <div className="misc">
        <h2>Delete card</h2>
        <button onClick={deleteCard}>Yes, delete card</button>
        <br />
        <br />
        <button onClick={close}>No, take me back</button>
      </div>
    </Modal>
  );
}

export default DeleteCard;
