import { AppTheme } from "@renderer/context/ThemeContext";
import { defaultSplitTreeBlueprint } from "./splits";
import { SceneConfigBlueprint } from "./tabs";
import { HotkeyConfig } from "./hotkey";
import debounce from "@renderer/utils/debounce";


export type WorkspaceConfig = {
  id: string;
  caption: string;
  sceneConfig: SceneConfigBlueprint;
};

export type AppConfig = {
  sceneConfigBlueprint: SceneConfigBlueprint;
  activeTheme: AppTheme;
  hotkeyConfig: HotkeyConfig;
};

export function defaultWorkspaceConfig(): WorkspaceConfig {
  return {
    id: "",
    caption: "",
    sceneConfig: {
      splitTree: defaultSplitTreeBlueprint()
    }
  };
}

export type ConfigFileUpdater = (appConfig: AppConfig) => void;

export function createConfigFileUpdater(configPath: string, delay: number): ConfigFileUpdater {

    // Debounced to avoid repeat writes
  return debounce((appConfig: AppConfig) => {
    if( appConfig ) {
      window.api.filesAPI.writeJSON<AppConfig>(configPath, appConfig);
    }
  }, delay);
}
