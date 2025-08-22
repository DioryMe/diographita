import { IDiographObject } from "@diograph/diograph/types";
import { Config, Diory, DiographData, IPCResponse } from "@diographita/core";

declare global {
  interface Window {
    electronAPI: {
      selectFolder: () => Promise<IPCResponse<string>>;
      getDioryInfo: (
        focusId: string,
        storyId?: string | null
      ) => Promise<IPCResponse<DioryInfo>>;
      getArchiveDiograph: (
        filter: IDioryDateGeoSearchProps
      ) => Promise<IPCResponse<IDioryObject[]>>;

      // New settings methods
      getArchiveRooms: () => Promise<IPCResponse<ArchiveRoom[]>>;
      addArchiveRoom: (roomPath: string) => Promise<IPCResponse<ArchiveRoom[]>>;
      removeArchiveRoom: (
        roomId: string
      ) => Promise<IPCResponse<ArchiveRoom[]>>;
    };
  }
}
