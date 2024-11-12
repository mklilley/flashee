import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { RecoilRoot } from "recoil";

import { MathfieldElement } from "mathlive";
MathfieldElement.fontsDirectory = "/assets/fonts";
MathfieldElement.soundsDirectory = null;

import { db } from "./services/storage";

async function init() {
  await db.init();

  ReactDOM.createRoot(document.getElementById("root")).render(
    <RecoilRoot>
      <App />
    </RecoilRoot>
  );
}

init();
