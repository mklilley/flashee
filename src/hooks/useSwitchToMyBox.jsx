import { useRecoilValue, useSetRecoilState } from "recoil";
import { myBoxIDState, myApiKeyState, reloadCardsState, usingMyBoxState } from "@globalState";

import { db } from "../services/storage";

export const useSwitchToMyBox = () => {
  const myBoxID = useRecoilValue(myBoxIDState);
  const myApiKey = useRecoilValue(myApiKeyState);
  const setReloadCards = useSetRecoilState(reloadCardsState);
  const setUsingMyBox = useSetRecoilState(usingMyBoxState);

  return async () => {
    // Switch to the user's box and API key
    await db.switch(myBoxID, myApiKey);

    // Pull cards data from the remote database
    await db.read({ remote: true });

    // Update Recoil state
    setReloadCards((prev) => prev + 1);
    setUsingMyBox(true);
  };
};
