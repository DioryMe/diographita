import { Config, Diory, DiographData, IPCResponse } from "@diographita/core";

declare global {
  interface Window {
    electronAPI: {
      helloWorld: () => Promise<IPCResponse<string>>;
      selectFolder: () => Promise<IPCResponse<string>>;
      getConfig: () => Promise<IPCResponse<Config>>;
      generateDiograph: (folderPath: string) => Promise<IPCResponse<void>>;
      loadDiograph: (folderPath: string) => Promise<IPCResponse<DiographData>>;
      getDiories: () => Promise<IPCResponse<Diory[]>>;
    };
  }
}
