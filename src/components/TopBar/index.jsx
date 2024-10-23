import { useState } from "react";
import { useRecoilValue } from 'recoil';
import { totalNumberOfCardsState } from '@globalState';

import styles from "./styles.module.css";
import SearchBar from "../SearchBar";

function TopBar({
  setShowSettingsModal,
  setCardToEdit,
  setShowEditModal,
  setSearchResults,
}) {
  const [searchVisible, setSearchVisible] = useState(false);
  const totalNumberOfCards = useRecoilValue(totalNumberOfCardsState);

  function showSettings() {
    setShowSettingsModal(true);
  }

  function toggleSearch() {
    setSearchVisible((prev) => !prev);
    setSearchResults(undefined);
  }

  function createCard() {
    setCardToEdit({ question: "", answer: "" });
    setShowEditModal(true);
  }

  if (totalNumberOfCards === undefined) {
    // Cards haven't been loaded yet so don't render anything
    return null;
  } else {
    return (
      <>
        <div className={styles["top-bar"]}>
          {totalNumberOfCards !== 0 && (
            <div>
              <i className={styles["gg-search"]} onClick={toggleSearch}>
                {searchVisible && <i className={styles["gg-close"]}></i>}
              </i>
            </div>
          )}
          {totalNumberOfCards !== 0 && (
            <div>
              <i className={styles["gg-add"]} onClick={createCard}></i>
            </div>
          )}

          <div>
            <i className={styles["gg-menu-boxed"]} onClick={showSettings}></i>
          </div>
        </div>
        {searchVisible && totalNumberOfCards !== 0 && (
          <SearchBar
            setSearchResults={setSearchResults}></SearchBar>
        )}
      </>
    );
  }
}

export default TopBar;
