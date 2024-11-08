import { SplitTreeBlueprint } from "./splits";

export type SplitTreeConfig = {
  splitTree: SplitTreeBlueprint;
};

export type WorkspaceViewsConfig = {
  [key in string]: SplitTreeConfig;
};

export type WorkspaceConfig = {
  id: string;
  caption: string;
  scene: {
    modules: SplitTreeConfig;
    views: WorkspaceViewsConfig;
  };
};

export type AppStateConfig = {
  activeWorkspaceIndex: number;
  workspaces: WorkspaceConfig[];
};
