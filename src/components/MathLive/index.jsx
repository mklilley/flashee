import styles from "./styles.module.css";
import { useRef, useEffect } from "react";

function MathLive({ latex, saveMath, close }) {
  const mathfieldRef = useRef(null);

  function saveAndClose() {
    console.log(`$$${mathfieldRef.current.getValue()}$$`);
    if (mathfieldRef.current.getValue() !== "") {
      saveMath(`$$${mathfieldRef.current.getValue()}$$`);
    } else {
      saveMath("");
    }
    close();
  }

  useEffect(() => {
    window.mathVirtualKeyboard.show({ animate: true });
    mathfieldRef.current.focus();
  }, []);

  return (
    <div className={styles["mathlive-container"] + " misc"}>
      <math-field
        style={{
          display: "block",
          width: "80%",
          "max-width": "500px",
          "font-size": "32px",
        }}
        ref={mathfieldRef}
        math-virtual-keyboard-policy="auto">
        {latex}
      </math-field>
      <br />
      <br />
      <button onClick={saveAndClose}>Save</button> <br />
      <button onClick={close}>Cancel</button>
    </div>
  );
}

export default MathLive;