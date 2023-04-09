import { useState } from "react";

import styles from "./styles.module.css";
import SearchBar from "../SearchBar";

function TopBar({}) {
  const [searchVisible, setSearchVisible] = useState(false);

  function toggleSearch() {
    setSearchVisible((prev) => !prev);
  }
  return (
    <>
      <div className={styles["top-bar"]}>
        <div>
          <i className={styles["gg-search"]} onClick={toggleSearch}></i>
        </div>

        <div>
          <i className={styles["gg-add"]}></i>
        </div>

        <div>
          <i className={styles["gg-menu-boxed"]}></i>
        </div>
      </div>
      {searchVisible && <SearchBar></SearchBar>}
    </>
  );
}

export default TopBar;
