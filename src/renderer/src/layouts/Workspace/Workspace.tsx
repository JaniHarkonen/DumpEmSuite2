import { TabContentProvider } from "@renderer/model/tabs";
import { ReactNode, useEffect, useState } from "react";
import CompaniesModule from "../modules/CompaniesModule/CompaniesModule";
import AnalysisModule from "../modules/AnalysisModule/AnalysisModule";
import { createTabContentProvider } from "../layoutUtils";
import useSceneConfig from "@renderer/hook/useSceneConfig";
import { WorkspaceContext, WorkspaceContextType } from "@renderer/context/WorkspaceContext";
import { WorkspaceConfig } from "@renderer/model/config";
import { bindAPIToWorkspace, BoundDatabaseAPI, QueryResult } from "../../../../shared/database.type";
import ModuleView from "../modules/ModuleView/ModuleView";


type Props = {
  workspaceConfig: WorkspaceConfig;
};

const {filesAPI, databaseAPI} = window.api;

export default function Workspace(props: Props): ReactNode {
  const pWorkspaceConfig: WorkspaceConfig = props.workspaceConfig;

  const [workspaceContext, setWorkspaceContext] = useState<WorkspaceContextType | null>(null);
  const {sceneConfig, handleSplitTreeUpdate} = useSceneConfig();

  useEffect(() => {
    const boundDatabaseAPI: BoundDatabaseAPI = bindAPIToWorkspace(
      "test",
      filesAPI.getWorkingDirectory() + "\\test-data\\test-database.db",
      databaseAPI
    );

    boundDatabaseAPI.open()
    .then((result: QueryResult) => {
      if( !result.wasSuccessful ) {
        return;
      }

      setWorkspaceContext({
        workspaceConfig: pWorkspaceConfig,
        databaseAPI: boundDatabaseAPI
      });
    });
  }, []);

  const modulesProvider: TabContentProvider = createTabContentProvider(
    {
      "module-companies": () => <CompaniesModule />,
      "module-analysis": () => <AnalysisModule />,
      "module-macro": () => <>macro module</>
    }
  );
  

  return (
    <>
      {workspaceContext ? (
        <WorkspaceContext.Provider
          value={{
            workspaceConfig: workspaceContext.workspaceConfig,
            databaseAPI: workspaceContext.databaseAPI
          }}
        >
          <ModuleView
            splitTreeBlueprint={sceneConfig.splitTree} 
            contentProvider={modulesProvider}
            onUpdate={handleSplitTreeUpdate}
          />
        </WorkspaceContext.Provider>
      ) : <>Opening database connection...</>}
    </>
  );
}
