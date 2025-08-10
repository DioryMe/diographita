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
  HELLO_WORLD: "HELLO_WORLD",
  SELECT_FOLDER: "SELECT_FOLDER",
  GET_CONFIG: "GET_CONFIG",
  GENERATE_DIOGRAPH: "GENERATE_DIOGRAPH",
  LOAD_DIOGRAPH: "LOAD_DIOGRAPH",
  GET_DIORIES: "GET_DIORIES",
  SAVE_DIORY: "SAVE_DIORY",
  GET_DIORY_INFO: "GET_DIORY_INFO",
} as const;

export type IPCAction = keyof typeof IPC_ACTIONS;
