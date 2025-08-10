import { IPC_ACTIONS } from "@diographita/core";
import { app, BrowserWindow, dialog, ipcMain } from "electron";
import { join } from "path";
import { getDioryInfo } from "./dioryInfo.util";

let mainWindow: BrowserWindow;

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
    properties: ["openDirectory"],
  });

  if (!result.canceled && result.filePaths.length > 0) {
    const folderPath = result.filePaths[0];
    return { success: true, data: folderPath };
  }

  return { success: false, error: "No folder selected" };
});

ipcMain.handle(IPC_ACTIONS.HELLO_WORLD, async () => {
  return "Hello world!123";
});

ipcMain.handle(
  IPC_ACTIONS.GET_DIORY_INFO,
  async (event, focusId: string, storyId?: string | null) => {
    try {
      const focusId = "e07c2f1d-5f5a-488a-a505-34f7b9f55105";
      const dioryInfo = getDioryInfo(focusId, storyId);
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
