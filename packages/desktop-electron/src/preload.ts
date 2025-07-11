import { contextBridge, ipcRenderer } from "electron";
import { IPC_ACTIONS } from "@diographita/core";

contextBridge.exposeInMainWorld("electronAPI", {
  // helloWorld: () => ipcRenderer.invoke("HELLO_WORLD"),
  // selectFolder: () => ipcRenderer.invoke("SELECT_FOLDER"),
  helloWorld: () => ipcRenderer.invoke(IPC_ACTIONS.HELLO_WORLD),
  selectFolder: () => ipcRenderer.invoke(IPC_ACTIONS.SELECT_FOLDER),
});
