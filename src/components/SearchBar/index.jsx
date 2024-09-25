import styles from "./styles.module.css";
import { useState, useEffect, useCallback, useRef } from "react";
import debounce from "lodash.debounce";
import lunr from "lunr";

import { db } from "../../services/storage";

function SearchBar({ rebuildSearchIndex, setSearchResults }) {
  const [searchIdx, setSearchIdx] = useState(null);
  const [isIndexBuilding, setIsIndexBuilding] = useState(true);
  const inputRef = useRef(null)


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
  }, [rebuildSearchIndex]);

    // Focus the input field when the component is rendered
    useEffect(() => {
      if (inputRef.current) {
        setTimeout(() => {
          inputRef.current.focus();
        }, 0); // Delay the focus until the next tick otherwise focus doesn't work for reasons I don't fully understand.
      }
    }, []);


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
        ref={inputRef} // Required for autofocus on load
        placeholder={isIndexBuilding ? "Building search index..." : "Search"}
        onChange={handleQuery}
        disabled={isIndexBuilding} // Disable input until index is ready
      />
    </div>
  );
}

export default SearchBar;
