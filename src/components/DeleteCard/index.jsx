import Modal from "../Modal";

import { useSetRecoilState, useRecoilValue } from "recoil";
import {
  reloadCardsState,
  cardToDeleteState,
  boxStatusState,
  useRemoteStorageState,
} from "@globalState";

import { db } from "../../services/storage";

function DeleteCard({ close }) {
  const setReloadCards = useSetRecoilState(reloadCardsState);
  const card = useRecoilValue(cardToDeleteState);
  const boxStatus = useRecoilValue(boxStatusState);
  const useRemoteStorage = useRecoilValue(useRemoteStorageState);

  async function deleteCard() {
    await db.delete(card.id, { remote: useRemoteStorage });
    setReloadCards((prev) => prev + 1);
    close();
  }

  return (
    <Modal close={close}>
      <h2>Delete card</h2>
      <div className="purple">
        {!boxStatus && useRemoteStorage && (
          <>
            <span className="error">
              {" "}
              Problem with online storage. Only local data will be deleted.
            </span>
            <br />
          </>
        )}
        <button onClick={deleteCard}>Yes, delete card</button>
        <br />
        <br />
        <button onClick={close}>No, take me back</button>
      </div>
    </Modal>
  );
}

export default DeleteCard;
