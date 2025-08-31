import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  IDioryObject,
  IDioryDateGeoSearchProps,
} from "@diograph/diograph/types";

export interface ArchiveState {
  filter: IDioryDateGeoSearchProps;
  archiveDiories: IDioryObject[];
  selectedDiory: IDioryObject | null;
  loading: boolean;
  error: string | null;
  isOverlayOpen: boolean;
}

const initialState: ArchiveState = {
  // filter: {
  //   latlngStart: "61.412517, 24.144045",
  //   latlngEnd: "61.402413, 24.169763",
  // },
  filter: {
    dateStart: "2022-05-01",
    dateEnd: "2022-05-31",
  },
  archiveDiories: [],
  selectedDiory: null,
  loading: false,
  error: null,
  isOverlayOpen: false,
};

export const fetchArchiveDiories = createAsyncThunk(
  "archive/fetchArchiveDiories",
  async (filter: IDioryDateGeoSearchProps) => {
    const response = await window.electronAPI.getArchiveDiograph(filter);
    if (response.success) {
      return response.data;
    } else {
      throw new Error(response.error);
    }
  }
);

const archiveSlice = createSlice({
  name: "archive",
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<IDioryDateGeoSearchProps>) => {
      state.filter = action.payload;
    },
    selectArchiveDiory: (state, action: PayloadAction<IDioryObject>) => {
      state.selectedDiory = action.payload;
      state.isOverlayOpen = true;
    },
    closeArchiveOverlay: (state) => {
      state.isOverlayOpen = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchArchiveDiories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArchiveDiories.fulfilled, (state, action) => {
        state.loading = false;
        state.archiveDiories = action.payload || [];
      })
      .addCase(fetchArchiveDiories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch archive diories";
      });
  },
});

export const { setFilter, selectArchiveDiory, closeArchiveOverlay } =
  archiveSlice.actions;
export default archiveSlice.reducer;
