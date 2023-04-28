import styles from "./styles.module.css";

function Modal({ children, close }) {
  function stop(e) {
    e.stopPropagation();
  }
  return (
    <div className={styles["modal-mask"]}>
      <div className={styles["modal-wrapper"]} onClick={close}>
        <div className={styles["modal-container"]} onClick={stop}>
          <span className={styles["close"]} onClick={close}>
            <i className={styles["gg-close-o"]}></i>
          </span>
          <div className={styles["modal-body"]}>{children}</div>
        </div>
      </div>
    </div>
  );
}

export default Modal;
