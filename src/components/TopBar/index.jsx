import { useState } from "react";

import styles from "./styles.module.css";
import SearchBar from "../SearchBar";

function TopBar({
  setCardToEdit,
  setShowEditModal,
  numberOfCards,
  reloadCards,
  setSearchResults,
}) {
  const [searchVisible, setSearchVisible] = useState(false);

  function toggleSearch() {
    setSearchVisible((prev) => !prev);
    setSearchResults(undefined);
  }

  function createCard() {
    setCardToEdit({ question: "", answer: "" });
    setShowEditModal(true);
  }

  if (numberOfCards === undefined) {
    // Cards haven't been loaded yet so don't render anything
    return null;
  } else {
    return (
      <>
        <div className={styles["top-bar"]}>
          {numberOfCards !== 0 && (
            <div>
              <i className={styles["gg-search"]} onClick={toggleSearch}>
                {searchVisible && <i className={styles["gg-close"]}></i>}
              </i>
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
        {searchVisible && numberOfCards !== 0 && (
          <SearchBar
            reloadCards={reloadCards}
            setSearchResults={setSearchResults}></SearchBar>
        )}
      </>
    );
  }
}

export default TopBar;
