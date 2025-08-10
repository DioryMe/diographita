import { IDioryObject } from "@diograph/diograph/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import diographMaryJson from "../../mary-json.json";

interface DioryState {
  focus: {
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
  focus: {
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
  const focusDiory = diographMaryJson["e07c2f1d-5f5a-488a-a505-34f7b9f55105"];
  const linkedDiories = Object.values(diographMaryJson);
  return {
    focusDiory,
    storyDiory: null,
    storyDiories: [],
    prevId: null,
    nextId: null,
    stories: linkedDiories,
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
      const newState = getDioryState(
        action.payload.focusId,
        action.payload.storyId
      );
      state.focus = { ...state.focus, ...newState };
    },
  },
});

export const { setFocus } = diorySlice.actions;
export default diorySlice.reducer;
