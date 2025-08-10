import { IDioryObject } from "@diograph/diograph/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import diographMaryJson from "../../mary-json.json";

interface DioryState {
  diory: {
    focusDiory: IDioryObject | null;
    storyDiory: IDioryObject | null;
    // focusId: string | null; => focusDiory.id
    // storyId: string | null; => storyDiory.id
    storyDiories: IDioryObject[];
    prevId: string | null;
    nextId: string | null;
    stories: IDioryObject[];
    CID: string | null;
    mimeType: string | null;
  };
}

const initialState: DioryState = {
  diory: {
    focusDiory: null,
    storyDiory: null,
    storyDiories: [],
    prevId: null,
    nextId: null,
    stories: [],
    CID: null,
    mimeType: null,
  },
};

// const maryDiograph = JSON.parse(diographMaryJson)
const getDioryState = (focusId, storyId) => {
  console.log("boom");
  const focusDiory = diographMaryJson["e07c2f1d-5f5a-488a-a505-34f7b9f55105"];
  const linkedDiory = diographMaryJson["5c63b738-2bc0-449c-80a8-be04dfe1e8b4"];
  return {
    focusDiory,
    storyDiory: null,
    storyDiories: [],
    prevId: null,
    nextId: null,
    stories: [linkedDiory],
    CID: null,
    mimeType: null,
  };
};

const diorySlice = createSlice({
  name: "diory",
  initialState,
  reducers: {
    setFocus(
      state,
      action: PayloadAction<{ focusId: string; storyId?: string | null }>
    ) {
      console.log("kah");
      const newState = getDioryState(
        action.payload.focusId,
        action.payload.storyId
      );
      console.log("oldstate", state);
      console.log("newStat", newState);
      state.diory = { ...state.diory, ...newState };
      state.diory.prevId = newState.focusDiory.text;
      console.log("state", state);
    },
  },
});

export const { setFocus } = diorySlice.actions;
export default diorySlice.reducer;
