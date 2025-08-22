import * as fs from "fs/promises";
import * as path from "path";

const SETTINGS_FILE = "./settings.ini"; // path.join(app.getPath("userData"), "settings.ini");

interface ArchiveRoom {
  id: string;
  name: string;
  path: string;
}

interface AppSettings {
  archiveRooms: ArchiveRoom[];
}

export class SettingsManager {
  private settings: AppSettings | null = null;

  async loadSettings(): Promise<AppSettings> {
    if (this.settings) {
      return this.settings;
    }

    try {
      const iniContent = await fs.readFile(SETTINGS_FILE, "utf8");
      this.settings = this.parseINI(iniContent);
      return this.settings;
    } catch (error) {
      this.settings = { archiveRooms: [] };
      await this.saveSettings(this.settings);
      return this.settings;
    }
  }

  async saveSettings(settings: AppSettings): Promise<void> {
    const iniContent = this.toINI(settings);
    await fs.writeFile(SETTINGS_FILE, iniContent, "utf8");
    this.settings = settings;
  }

  async updateSettings(updates: Partial<AppSettings>): Promise<AppSettings> {
    const currentSettings = await this.loadSettings();
    const newSettings = {
      ...currentSettings,
      ...updates,
    };
    await this.saveSettings(newSettings);
    return newSettings;
  }

  async getArchiveRooms(): Promise<ArchiveRoom[]> {
    const settings = await this.loadSettings();
    return settings.archiveRooms;
  }

  async addArchiveRoom(roomPath: string): Promise<ArchiveRoom[]> {
    const settings = await this.loadSettings();
    const roomName = path.basename(path.dirname(roomPath));
    const newRoom: ArchiveRoom = {
      id: `room${Date.now()}`,
      name: roomName,
      path: roomPath,
    };

    settings.archiveRooms.push(newRoom);
    await this.saveSettings(settings);
    return settings.archiveRooms;
  }

  async removeArchiveRoom(roomId: string): Promise<ArchiveRoom[]> {
    const settings = await this.loadSettings();
    settings.archiveRooms = settings.archiveRooms.filter(
      (room) => room.id !== roomId
    );
    await this.saveSettings(settings);
    return settings.archiveRooms;
  }

  // TODO: Use ini-library?
  private parseINI(content: string): AppSettings {
    const lines = content.split("\n");
    const archiveRooms: ArchiveRoom[] = [];
    let currentSection = "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
        currentSection = trimmed.slice(1, -1);
        continue;
      }

      if (trimmed.includes("=")) {
        const [key, value] = trimmed.split("=");

        if (currentSection === "Archive Rooms") {
          archiveRooms.push({
            id: key.trim(),
            name: path.basename(path.dirname(value.trim())),
            path: value.trim(),
          });
        }
      }
    }

    return {
      archiveRooms,
    };
  }

  private toINI(settings: AppSettings): string {
    let content = "[Archive Rooms]\n";
    settings.archiveRooms.forEach((room, index) => {
      content += `room${index + 1}=${room.path}\n`;
    });

    return content;
  }
}

export const settingsManager = new SettingsManager();
