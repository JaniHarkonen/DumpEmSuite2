import { defaultSplitTreeBlueprint } from "./splits";
import { SceneConfigBlueprint } from "./tabs";


export type WorkspaceConfig = {
  id: string;
  caption: string;
  sceneConfig: SceneConfigBlueprint;
};

export type AppConfig = {
  sceneConfigBlueprint: SceneConfigBlueprint;
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
  return (appConfig: AppConfig) => {
    window.api.filesAPI.writeJSON<AppConfig>(configPath, appConfig);
  }
}
