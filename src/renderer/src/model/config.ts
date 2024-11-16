import { defaultSplitTree, SplitTreeBlueprint } from "./splits";


export type SceneTabsConfig = {
  [key in string]: SceneConfig;
};

export type SceneConfig = {
  splitTree: SplitTreeBlueprint;
  tabs?: SceneTabsConfig;
};

export type WorkspaceConfig = {
  id: string;
  caption: string;
  scene: SceneConfig;
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
    scene: {
      splitTree: defaultSplitTree()
    }
  };
}

export function defaultSceneConfig(): SceneConfig {
  return {
    splitTree: defaultSplitTree()
  };
}

export type ConfigFileUpdater = (appStateConfig: AppStateConfig) => void;

export function createConfigFileUpdater(configPath: string): ConfigFileUpdater {
  return (appStateConfig: AppStateConfig) => {
    window.api.filesAPI.writeJSON<AppStateConfig>(configPath, appStateConfig);
  }
}
