import { IDioryObject } from "@diograph/diograph/types";
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

interface DioryState {
  focus: {
    focusDiory: IDioryObject | null;
    storyDiory: IDioryObject | null;
    focusId: string | null;
    storyId: string | null;
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
    focusId: null,
    storyId: null,
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
    const response = await window.electronAPI.getDioryInfo(focusId, storyId);
    if (response.success) {
      dispatch(setFocus({ newState: response.data }));
    } else {
      throw new Error(response.error);
    }
  }
);
export const selectStoryDiory = createAsyncThunk(
  "diory/selectStoryDiory",
  async ({ focusId, storyId }: { focusId: string; storyId: string }) => {
    const response = await window.electronAPI.getDioryInfo(focusId, storyId);
    if (response.success) {
      return response.data;
    } else {
      throw new Error(response.error);
    }
  }
);

const diorySlice = createSlice({
  name: "diory",
  initialState,
  reducers: {
    setFocus(state, action: PayloadAction<{ newState: DioryState["focus"] }>) {
      state.focus = { ...state.focus, ...action.payload.newState };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDioryInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDioryInfo.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchDioryInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch diory info";
      })
      .addCase(selectStoryDiory.fulfilled, (state, action) => {
        state.focus = action.payload.focus;
        state.loading = false;
      });
  },
});

export const { setFocus } = diorySlice.actions;
export default diorySlice.reducer;
