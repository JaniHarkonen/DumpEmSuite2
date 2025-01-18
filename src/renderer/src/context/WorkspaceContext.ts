import { defaultWorkspaceConfig, WorkspaceConfig } from "@renderer/model/config";
import { createContext } from "react";
import { BoundDatabaseAPI } from "src/shared/database.type";


export type WorkspaceContextType = {
  workspaceConfig: WorkspaceConfig;
  workspacePath?: string;
  databaseAPI?: BoundDatabaseAPI;
};

export const WorkspaceContext = createContext<WorkspaceContextType>({
  workspaceConfig: defaultWorkspaceConfig()
});
