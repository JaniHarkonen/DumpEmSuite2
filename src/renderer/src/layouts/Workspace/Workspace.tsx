import { defaultSceneConfigBlueprint, Tab, TabContentProvider } from "@renderer/model/tabs";
import { ReactNode, useContext, useEffect, useState } from "react";
import CompaniesModule from "../modules/CompaniesModule/CompaniesModule";
import AnalysisModule from "../modules/AnalysisModule/AnalysisModule";
import { createTabContentProvider } from "../layoutUtils";
import useSceneConfig from "@renderer/hook/useSceneConfig";
import { WorkspaceContext, WorkspaceContextType } from "@renderer/context/WorkspaceContext";
import { bindAPIToWorkspace, BoundDatabaseAPI, QueryResult } from "../../../../shared/database.type";
import ModuleView from "../ModuleView/ModuleView";
import MacroModule from "../modules/MacroModule/MacroModule";
import { TabsContext } from "@renderer/context/TabsContext";
import { RELATIVE_APP_PATHS } from "../../../../../src/shared/appConfig";


const {databaseAPI} = window.api;

export default function Workspace(): ReactNode {
  const [workspaceContext, setWorkspaceContext] = useState<WorkspaceContextType | null | undefined>(undefined);
  
  const {sceneConfig, handleSplitTreeUpdate} = useSceneConfig();
  const {tabs, activeTabIndex} = useContext(TabsContext);

  const activeTab: Tab = tabs[activeTabIndex];
  const workspacePath: string = activeTab.extra.path;

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
      } else {
        setWorkspaceContext(null);
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

  if( workspaceContext === undefined ) {
    return <>Opening database connection...</>;
  } else if( workspaceContext === null ) {
    return (
      <>
        <p>Failed to open database! Close the database and try to re-open.</p>
        <p>Path: {workspacePath}</p>
      </>
    );
  }

  return (
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
  );
}
