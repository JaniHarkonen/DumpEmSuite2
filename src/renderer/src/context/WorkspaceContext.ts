import { nullWorkspaceConfig, WorkspaceConfig } from "@renderer/model/config";
import { createContext } from "react";


type WorkspaceContextType = {
  workspaceConfig: WorkspaceConfig;
};

export const WorkspaceContext = createContext<WorkspaceContextType>({
  workspaceConfig: nullWorkspaceConfig()
});
