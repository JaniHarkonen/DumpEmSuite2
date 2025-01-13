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
import { RELATIVE_APP_PATHS } from "../../../../../src/shared/appConfig";


const {databaseAPI, filesAPI} = window.api;

export default function Workspace(): ReactNode {
  const [workspaceContext, setWorkspaceContext] = useState<WorkspaceContextType | null>(null);
  
  const {sceneConfig, handleSplitTreeUpdate} = useSceneConfig();
  const {tabs, activeTabIndex} = useContext(TabsContext);

  const activeTab: Tab = tabs[activeTabIndex];
  const workspacePath: string = filesAPI.getWorkingDirectory() + activeTab.extra.path; // getWorkingDirectory-PART IS ONLY TO BE USED IN DEV

  useEffect(() => {
    if( !activeTab.extra ) {
      return;
    }

    const boundDatabaseAPI: BoundDatabaseAPI = bindAPIToWorkspace(
      activeTab.id, RELATIVE_APP_PATHS.make.database(workspacePath), databaseAPI
    );

    const setContext = () => {
      setWorkspaceContext({
        workspaceConfig: {
          id: activeTab.id,
          caption: activeTab.caption,
          sceneConfig: activeTab.sceneConfig || defaultSceneConfigBlueprint()
        },
        databaseAPI: boundDatabaseAPI
      });
    };

    boundDatabaseAPI.open()
    .then((result: QueryResult) => {
        // Set the database context on open
      if( result.wasSuccessful ) {
        setContext();
      }
    }).catch((result: QueryResult) => {
        // If the database was already open, we can still set the database context.
        // Otherwise, the context wont be set.
      if( result.error?.name === "already-open" ) {
        setContext();
      }
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
            databaseAPI: workspaceContext.databaseAPI,
            workspacePath
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
