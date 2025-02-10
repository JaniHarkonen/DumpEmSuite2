import { AppTheme } from "@renderer/context/ThemeContext";
import { defaultSplitTreeBlueprint } from "./splits";
import { SceneConfigBlueprint } from "./tabs";


export type WorkspaceConfig = {
  id: string;
  caption: string;
  sceneConfig: SceneConfigBlueprint;
};

export type AppConfig = {
  sceneConfigBlueprint: SceneConfigBlueprint;
  activeTheme: AppTheme;
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

export function createConfigFileUpdater(configPath: string): ConfigFileUpdater {
  let timeout: NodeJS.Timeout | null = null;

    // Debounced to avoid repeat writes
  return (appConfig: AppConfig) => {
      // App config shouldn't be nullish, but if it is, default to doing nothing to avoid wiping
      // the config file
    if( !appConfig ) {
      return;
    }

    if( timeout ) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      window.api.filesAPI.writeJSON<AppConfig>(configPath, appConfig);
    }, 1000);
  }
}
