import styles from "./styles.module.css";

function SearchBar({}) {
  return (
    <div className={styles["search-bar"]}>
      <input type="search" placeholder="Search" />
    </div>
  );
}

export default SearchBar;
