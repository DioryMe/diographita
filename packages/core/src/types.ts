export interface Diory {
  id: string;
  text?: string;
  image?: string;
  latlng?: string;
  date?: string;
  data?: Record<string, any>;
  links?: string[];
}

export interface Config {
  folderPath?: string;
}

export interface DiographData {
  diories: Diory[];
}

// IPC Message Types
export interface IPCMessage<T = any> {
  type: string;
  payload?: T;
}

export interface IPCResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

// IPC Actions
export const IPC_ACTIONS = {
  SELECT_FOLDER: "SELECT_FOLDER",
  GET_DIORY_INFO: "GET_DIORY_INFO",
  GET_ARCHIVE_DIOGRAPH: "GET_ARCHIVE_DIOGRAPH",

  // Settings
  GET_ARCHIVE_ROOMS: "GET_ARCHIVE_ROOMS",
  ADD_ARCHIVE_ROOM: "ADD_ARCHIVE_ROOM",
  REMOVE_ARCHIVE_ROOM: "REMOVE_ARCHIVE_ROOM",
} as const;

export type IPCAction = keyof typeof IPC_ACTIONS;
