import { useState } from "react";

import styles from "./styles.module.css";
import SearchBar from "../SearchBar";

function TopBar({ setCardToEdit, setShowEditModal, numberOfCards }) {
  const [searchVisible, setSearchVisible] = useState(false);

  function toggleSearch() {
    setSearchVisible((prev) => !prev);
  }

  function createCard() {
    setCardToEdit({ question: "", answer: "" });
    setShowEditModal(true);
  }

  return (
    <>
      <div className={styles["top-bar"]}>
        {numberOfCards !== 0 && (
          <div>
            <i className={styles["gg-search"]} onClick={toggleSearch}></i>
          </div>
        )}
        {numberOfCards !== 0 && (
          <div>
            <i className={styles["gg-add"]} onClick={createCard}></i>
          </div>
        )}

        <div>
          <i className={styles["gg-menu-boxed"]}></i>
        </div>
      </div>
      {searchVisible && <SearchBar></SearchBar>}
    </>
  );
}

export default TopBar;
