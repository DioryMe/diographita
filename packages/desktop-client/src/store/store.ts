import { configureStore } from "@reduxjs/toolkit";
import dioryReducer from "./diorySlice";
import archiveReducer from "./archiveSlice";

export const store = configureStore({
  reducer: {
    diory: dioryReducer,
    archive: archiveReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
