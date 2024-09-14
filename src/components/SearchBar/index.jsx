import styles from "./styles.module.css";
import { useState, useEffect, useCallback } from "react";
import debounce from "lodash.debounce";
import lunr from "lunr";

import { db } from "../../services/storage";

function SearchBar({ reloadCards, setSearchResults }) {
  const [searchIdx, setSearchIdx] = useState(null);
  const [isIndexBuilding, setIsIndexBuilding] = useState(true);


  useEffect(() => {
    async function buildIndex() {
      setIsIndexBuilding(true); // Set loading state when starting to build index

      // Load cards from the database
      const cards = await db.read({});

      // Create the Lunr index
      if (cards.length > 0) {
        const index = lunr(function () {
          this.ref("id");
          this.field("question");

          cards.forEach(function (doc) {
            this.add(doc);
          }, this);
        });

        // Set the search index in state
        setSearchIdx(index);
      }

      setIsIndexBuilding(false); // Set to false when index is built
    }

    buildIndex();
  }, [reloadCards]);


 const searchDeck = useCallback(
  debounce(function (query) {
    if (!searchIdx) return; // Prevent search if index isn't ready

    let searchResults = searchIdx.search(query);

    searchResults = searchResults.map(function (result) {
      return result.ref;
    });

    setSearchResults(searchResults);
  }, 600),
  [searchIdx]
);

  function handleQuery(e) {
    searchDeck(e.target.value);
  }

  return (
    <div className={styles["search-bar"]}>
      <input
        type="search"
        placeholder={isIndexBuilding ? "Building search index..." : "Search"}
        onChange={handleQuery}
        autoFocus
        disabled={isIndexBuilding} // Disable input until index is ready
      />
    </div>
  );
}

export default SearchBar;
