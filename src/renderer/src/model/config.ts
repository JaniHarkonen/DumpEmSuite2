import { SplitTreeBlueprint } from "./splits";


type WorkspaceSceneConfig = {
  id: string;
  caption: string;
  scene: {
    splitTree: SplitTreeBlueprint;
  };
};

export type AppStateConfig = {
  workspaces: WorkspaceSceneConfig[];
};
