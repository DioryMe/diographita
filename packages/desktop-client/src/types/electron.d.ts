import { Config, Diory, DiographData, IPCResponse } from "@diographita/core";

declare global {
  interface Window {
    electronAPI: {
      selectFolder: () => Promise<IPCResponse<string>>;
      getDioryInfo: (
        focusId: string,
        storyId?: string | null
      ) => Promise<IPCResponse<DioryInfo>>;
    };
  }
}
