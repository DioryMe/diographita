import { IPC_ACTIONS } from "@diographita/core";
import { app, BrowserWindow, dialog, ipcMain } from "electron";
import { join } from "path";
import { getDioryInfo } from "./dioryInfo.util";
import { Diograph } from "@diograph/diograph";
import { IDiographObject } from "@diograph/diograph/types";
import { readFile } from "fs/promises";
import { validateDiograph } from "@diograph/diograph/validator";

let mainWindow: BrowserWindow;

const diographs: Record<string, IDiographObject> = {};
let folderPathInFocus: string | null = null;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: join(__dirname, "preload.js"),
    },
  });

  // if (process.env.NODE_ENV === "development") {
  mainWindow.loadURL("http://localhost:5173");
  mainWindow.webContents.openDevTools();
  // } else {
  // mainWindow.loadFile(join(__dirname, "desktop-client", "dist", "index.html"));
  // }
};

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

ipcMain.handle(IPC_ACTIONS.SELECT_FOLDER, async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    // properties: ["openDirectory"],
    properties: ["openFile"],
  });

  if (!result.canceled && result.filePaths.length > 0) {
    const folderPath = result.filePaths[0];

    // TODO: Move to non-blocking thread
    try {
      const jsonContent = await readFile(folderPath, { encoding: "utf8" });
      const diographObject = JSON.parse(jsonContent);
      validateDiograph(diographObject);

      if (diographObject) {
        diographs[folderPath] = diographObject;
        folderPathInFocus = folderPath;
        return { success: true, data: folderPath };
      }
    } catch (error) {
      return { success: false, error };
    }
  }

  return { success: false, error: "No folder selected" };
});

ipcMain.handle(IPC_ACTIONS.HELLO_WORLD, async () => {
  return "Hello world!123";
});

ipcMain.handle(
  IPC_ACTIONS.GET_DIORY_INFO,
  async (event, focusId: string, storyId?: string | null) => {
    // const diographMaryJson = require("../../desktop-client/diograph.json");
    if (!folderPathInFocus || !diographs[folderPathInFocus]) {
      return {
        success: false,
        error: "No folder selected",
      };
    }

    const diograph = new Diograph(diographs[folderPathInFocus]);

    try {
      const dioryInfo = getDioryInfo(diograph, focusId, storyId);
      const dioryState = {
        focusId: dioryInfo.focusId,
        focusDiory: dioryInfo.focusDiory,
        storyId: dioryInfo.storyId,
        storyDiory: dioryInfo.story,
        storyDiories: dioryInfo.focus.linkedDiories,
        prevId: dioryInfo.prev,
        nextId: dioryInfo.next,
        stories: dioryInfo.stories,
        CID: dioryInfo.focus.data?.contentUrl,
        mime: dioryInfo.focus.data?.encodingFormat,
      };
      return { success: true, data: dioryState };
    } catch (error) {
      console.log("errr", error);

      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
);
