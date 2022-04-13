import { IconifyIcon } from "@iconify/types";
import { KeyGesture } from "../../util/KeyGesture";

export interface Separator {
  type: "separator";
}

// electron.MenuItemConstructorOptions["role"]
type ElectronRole =
  | "undo"
  | "redo"
  | "cut"
  | "copy"
  | "paste"
  | "pasteAndMatchStyle"
  | "delete"
  | "selectAll"
  | "reload"
  | "forceReload"
  | "toggleDevTools"
  | "resetZoom"
  | "zoomIn"
  | "zoomOut"
  | "togglefullscreen"
  | "window"
  | "minimize"
  | "close"
  | "help"
  | "about"
  | "services"
  | "hide"
  | "hideOthers"
  | "unhide"
  | "quit"
  | "startSpeaking"
  | "stopSpeaking"
  | "zoom"
  | "front"
  | "appMenu"
  | "fileMenu"
  | "editMenu"
  | "viewMenu"
  | "shareMenu"
  | "recentDocuments"
  | "toggleTabBar"
  | "selectNextTab"
  | "selectPreviousTab"
  | "mergeAllWindows"
  | "clearRecentDocuments"
  | "moveTabToNewWindow"
  | "windowMenu";

export interface ElectronCommand {
  role: ElectronRole;
  children?: readonly MenuItem[];
}

export interface Command {
  title: string;
  icon?: IconifyIcon;
  disabled?: boolean;
  selected?: boolean;
  shortcut?: readonly KeyGesture[];
  run?(): boolean;
}

export interface Menu {
  title: string;
  icon?: IconifyIcon;
  disabled?: boolean;
  children: readonly MenuItem[];
}

export type MenuItem = Separator | Command | ElectronCommand | Menu;

export const MenuItem = {
  removeDuplicateSeparators(items: readonly MenuItem[]): MenuItem[] {
    const result: MenuItem[] = [];
    let isLastSeparator = false;
    for (const item of items) {
      if ("type" in item && item.type === "separator") {
        if (isLastSeparator) {
          continue;
        }
        isLastSeparator = true;
      } else {
        isLastSeparator = false;
      }
      result.push(item);
    }

    if (result.length > 0) {
      const firstItem = result[0];
      if ("type" in firstItem && firstItem.type === "separator") {
        result.shift();
      }
    }
    if (result.length > 0) {
      const lastItem = result[result.length - 1];
      if ("type" in lastItem && lastItem.type === "separator") {
        result.pop();
      }
    }

    return result;
  },

  filterDisabled(items: readonly MenuItem[]): MenuItem[] {
    return this.removeDuplicateSeparators(
      items.filter((item) => {
        if ("disabled" in item) {
          return !item.disabled;
        }
        return true;
      })
    );
  },
};
