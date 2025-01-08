import { defaultSceneConfigBlueprint, Tab, TabContentProvider } from "@renderer/model/tabs";
import { ReactNode, useContext, useEffect, useState } from "react";
import CompaniesModule from "../modules/CompaniesModule/CompaniesModule";
import AnalysisModule from "../modules/AnalysisModule/AnalysisModule";
import { createTabContentProvider } from "../layoutUtils";
import useSceneConfig from "@renderer/hook/useSceneConfig";
import { WorkspaceContext, WorkspaceContextType } from "@renderer/context/WorkspaceContext";
import { bindAPIToWorkspace, BoundDatabaseAPI, QueryResult } from "../../../../shared/database.type";
import ModuleView from "../modules/ModuleView/ModuleView";
import MacroModule from "../modules/MacroModule/MacroModule";
import { TabsContext } from "@renderer/context/TabsContext";


const {filesAPI, databaseAPI} = window.api;

export default function Workspace(): ReactNode {
  const [workspaceContext, setWorkspaceContext] = useState<WorkspaceContextType | null>(null);
  
  const {sceneConfig, handleSplitTreeUpdate} = useSceneConfig();
  const {tabs, activeTabIndex} = useContext(TabsContext);

  const activeTab: Tab = tabs[activeTabIndex];

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
        workspaceConfig: {
          id: activeTab.id,
          caption: activeTab.caption,
          sceneConfig: activeTab.sceneConfig || defaultSceneConfigBlueprint()
        },
        databaseAPI: boundDatabaseAPI
      });
    });
  }, []);

  const modulesProvider: TabContentProvider = createTabContentProvider(
    {
      "module-companies": () => <CompaniesModule />,
      "module-analysis": () => <AnalysisModule />,
      "module-macro": () => <MacroModule />
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
