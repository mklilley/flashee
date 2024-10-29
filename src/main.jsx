import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { RecoilRoot } from "recoil";

import { MathfieldElement } from "mathlive";
MathfieldElement.fontsDirectory = "/assets/fonts";
MathfieldElement.soundsDirectory = null;

ReactDOM.createRoot(document.getElementById("root")).render(
  <RecoilRoot>
    <App />
  </RecoilRoot>
);
