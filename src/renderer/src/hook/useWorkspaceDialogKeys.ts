import { WorkspaceContext } from "@renderer/context/WorkspaceContext";
import { useContext } from "react";


type FormatDialogKey = (keyBase: string) => string;

type Returns = {
  formatDialogKey: FormatDialogKey;
};

export default function useWorkspaceDialogKeys(): Returns {
  const {workspaceConfig} = useContext(WorkspaceContext);

  const formatDialogKey = (keyBase: string) => {
    return workspaceConfig.id === "" ? keyBase : workspaceConfig.id + "-" + keyBase;
  };

  return {
    formatDialogKey
  };
}
