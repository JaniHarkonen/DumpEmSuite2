import { defaultSplitTree, SplitTreeBlueprint } from "./splits";

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
  workspaces: WorkspaceConfig[];
};

export function nullWorkspaceConfig(): WorkspaceConfig {
  return {
    id: "",
    caption: "",
    scene: {
      modules: {
        splitTree: defaultSplitTree()
      },
      views: {}
    }
  };
}
