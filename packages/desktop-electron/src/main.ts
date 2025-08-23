import { IPC_ACTIONS } from "@diographita/core";
import { app, BrowserWindow, dialog, ipcMain, protocol, net } from "electron";
import { pathToFileURL } from "url";
import { join } from "path";
import { getDioryInfo } from "./dioryInfo.util";
import { Diograph } from "@diograph/diograph";
import {
  IDiographObject,
  IDioryDateGeoSearchProps,
  IDioryObject,
} from "@diograph/diograph/types";
import { readFile } from "fs/promises";
import { validateDiograph } from "@diograph/diograph/validator";
import { filterAndSortDiograph } from "./main.util";
import { settingsManager } from "./settingsManager";

let mainWindow: BrowserWindow;

const diographs: Record<string, IDiographObject> = {};
let folderPathInFocus: string | null = null;
const filePathMapping: Record<string, string> = {
  abcdefghijklmn: "/Users/Jouni/MyPictures/my-pic.jpg",
  video: "/Users/Jouni/MyPictures/2022-12-26 18.34.04.mp4",
};

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

protocol.registerSchemesAsPrivileged([
  {
    scheme: "app",
    privileges: {
      standard: true,
      secure: true,
      allowServiceWorkers: true,
      supportFetchAPI: true,
      corsEnabled: true,
      stream: true, // Important for seekable media
    },
  },
]);

app.whenReady().then(async () => {
  await loadArchiveRoomsFromSettings();
  protocol.handle("app", (request) => {
    const parsedUrl = new URL(request.url);
    const cid = parsedUrl.hostname;
    const filePath = filePathMapping[cid];

    if (!filePath) {
      return new Response("File not found", { status: 404 });
    }

    // Use pathToFileURL to ensure proper file:// URL format
    const fileUrl = pathToFileURL(filePath).href;
    return net.fetch(fileUrl);
  });

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

const loadDiograph = async (folderPath: string) => {
  const jsonContent = await readFile(folderPath, { encoding: "utf8" });
  const diographObject: IDiographObject = JSON.parse(jsonContent);
  validateDiograph(diographObject);

  if (diographObject) {
    diographs[folderPath] = diographObject;
  }
};

const loadArchiveRoomsFromSettings = async () => {
  const startTime = Date.now();
  try {
    const archiveRooms = await settingsManager.getArchiveRooms();

    await Promise.all(
      archiveRooms.map((room) => {
        return new Promise((resolve, reject) => {
          try {
            loadDiograph(room.path).then((result) => {
              resolve(result);
            });
          } catch (error) {
            reject(
              `Failed to load archive room ${room.name}: ${JSON.stringify(
                error
              )}`
            );
          }
        });
      })
    );
    console.log(`Loaded archiverooms in ${Date.now() - startTime}ms. `);
  } catch (error) {
    console.error("Failed to load settings:", error);
  }
};

// ======

// IPC ACTIONS

// =====

ipcMain.handle(IPC_ACTIONS.SELECT_FOLDER, async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    // properties: ["openDirectory"],
    properties: ["openFile"],
  });

  if (!result.canceled && result.filePaths.length > 0) {
    const folderPath = result.filePaths[0];

    // TODO: Move to non-blocking thread
    try {
      await loadDiograph(folderPath);
      return { success: true, data: folderPath };
    } catch (error) {
      return { success: false, error };
    }
  }

  return { success: false, error: "No folder selected" };
});

ipcMain.handle(
  IPC_ACTIONS.GET_DIORY_INFO,
  async (event, focusId: string, storyId?: string | null) => {
    const settings = await settingsManager.loadSettings();
    folderPathInFocus = settings.myDioryPath;
    await loadDiograph(folderPathInFocus);
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

ipcMain.handle(
  IPC_ACTIONS.GET_ARCHIVE_DIOGRAPH,
  async (event, filter: IDioryDateGeoSearchProps) => {
    const startTime = Date.now();
    try {
      // Compose archiveDiograph
      const archiveDiograph = Object.values(diographs).reduce((acc, other) => {
        acc.initialise(other);
        return acc;
      }, new Diograph());
      console.log(`archiveDiograph composed in ${Date.now() - startTime}ms. `);

      // Apply filter
      const archiveDiories: IDioryObject[] = filterAndSortDiograph(
        archiveDiograph,
        filter
      );

      console.log(`archiveDiories generated in ${Date.now() - startTime}ms. `);

      return {
        success: true,
        data: archiveDiories,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
);

ipcMain.handle(IPC_ACTIONS.GET_ARCHIVE_ROOMS, async () => {
  try {
    const settings = await settingsManager.loadSettings();
    return { success: true, data: settings.archiveRooms };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to get archive rooms",
    };
  }
});

ipcMain.handle(
  IPC_ACTIONS.ADD_ARCHIVE_ROOM,
  async (event, roomPath: string) => {
    try {
      const rooms = await settingsManager.addArchiveRoom(roomPath);
      await loadDiograph(roomPath); // Load immediately
      return { success: true, data: rooms };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to add archive room",
      };
    }
  }
);

ipcMain.handle(
  IPC_ACTIONS.REMOVE_ARCHIVE_ROOM,
  async (event, roomId: string) => {
    try {
      const rooms = await settingsManager.removeArchiveRoom(roomId);
      // Find and remove the diograph from memory
      const settings = await settingsManager.loadSettings();
      const removedRoom = settings.archiveRooms.find((r) => r.id === roomId);
      if (removedRoom && diographs[removedRoom.path]) {
        delete diographs[removedRoom.path];
      }
      return { success: true, data: rooms };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to remove archive room",
      };
    }
  }
);
