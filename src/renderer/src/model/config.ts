import { defaultSplitTreeBlueprint } from "./splits";
import { SceneConfigBlueprint } from "./tabs";


export type WorkspaceConfig = {
  id: string;
  caption: string;
  sceneConfig: SceneConfigBlueprint;
};

export type AppStateConfig = {
  workspaces: WorkspaceConfig[];
};

export function AppStateConfig(): AppStateConfig {
  return {
    workspaces: []
  };
}

export function defaultWorkspaceConfig(): WorkspaceConfig {
  return {
    id: "",
    caption: "",
    sceneConfig: {
      splitTree: defaultSplitTreeBlueprint()
    }
  };
}

export type ConfigFileUpdater = (appStateConfig: AppStateConfig) => void;

export function createConfigFileUpdater(configPath: string): ConfigFileUpdater {
  return (appStateConfig: AppStateConfig) => {
    window.api.filesAPI.writeJSON<AppStateConfig>(configPath, appStateConfig);
  }
}
