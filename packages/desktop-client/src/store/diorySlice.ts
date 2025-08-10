import { IDioryObject } from "@diograph/diograph/types";
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
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
  loading: boolean;
  error: string | null;
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
  loading: false,
  error: null,
};

export const fetchDioryInfo = createAsyncThunk(
  "diory/fetchDioryInfo",
  async (
    {
      focusId,
      storyId,
    }: {
      focusId: string;
      storyId?: string | null;
    },
    { dispatch }
  ) => {
    try {
      const result = await window.electronAPI.getDioryInfo(focusId, storyId);
      dispatch(setFocus2({ newState: result.data }));
      return result.data;
    } catch (error) {
      console.error("fetchDioryInfo error", error);
    }
  }
);

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
    setFocus2(state, action: PayloadAction<{ newState: DioryState["focus"] }>) {
      state.focus = { ...state.focus, ...action.payload.newState };
    },
  },
  // extraReducers: (builder) => {
  //   builder
  //     .addCase(fetchDioryInfo.pending, (state) => {
  //       state.loading = true;
  //       state.error = null;
  //     })
  //     .addCase(fetchDioryInfo.fulfilled, (state, action) => {
  //       state.loading = false;
  //       console.log("fetchDioryInfo.fulfilled", action.payload);
  //       const dioryInfo = action.payload;
  //       state.focus = {
  //         focusDiory: dioryInfo.focusDiory,
  //         storyDiory: dioryInfo.story,
  //         storyDiories: [], // TODO: map from story links
  //         prevId: dioryInfo.prev,
  //         nextId: dioryInfo.next,
  //         stories: dioryInfo.stories,
  //         CID: null,
  //         mimeType: null,
  //       };
  //     })
  //     .addCase(fetchDioryInfo.rejected, (state, action) => {
  //       state.loading = false;
  //       state.error = action.error.message || "Failed to fetch diory info";
  //     });
  // },
});

export const { setFocus, setFocus2 } = diorySlice.actions;
export default diorySlice.reducer;
