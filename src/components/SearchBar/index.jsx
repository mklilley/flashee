import styles from "./styles.module.css";
import { useState, useMemo, useEffect, useCallback } from "react";
import debounce from "lodash.debounce";
import lunr from "lunr";

import { db } from "../../services/storage";

function SearchBar({ reloadCards, setSearchResults }) {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    async function loadCards() {
      setCards(await db.read({}));
    }
    loadCards();
  }, [reloadCards]);

  const searchIdx = useMemo(
    () =>
      lunr(function () {
        this.ref("id");
        this.field("question");

        cards.forEach(function (doc) {
          this.add(doc);
        }, this);
      }),
    [cards]
  );

  const searchDeck = useCallback(
    debounce(function (query) {
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
        placeholder="Search"
        onChange={handleQuery}
        autoFocus
      />
    </div>
  );
}

export default SearchBar;
