import ModuleView, { ModuleProps } from "@renderer/components/ModuleView/ModuleView";
import { TabContentProvider } from "@renderer/model/tabs";
import { ReactNode, useContext } from "react";
import CompaniesModule from "../modules/CompaniesModule/CompaniesModule";
import { WorkspaceViewsConfig } from "@renderer/model/config";
import AnalysisModule from "../modules/AnalysisModule/AnalysisModule";
import { WorkspaceContext } from "@renderer/context/WorkspaceContext";
import { SplitTreeBlueprint } from "@renderer/model/splits";


export default function Workspace(props: ModuleProps): ReactNode {
   const pSceneBlueprint: SplitTreeBlueprint | null = props.sceneBlueprint;

  const {workspaceConfig} = useContext(WorkspaceContext);
  const viewsConfig: WorkspaceViewsConfig = workspaceConfig.scene.views;

  const modulesProvider: TabContentProvider = {
    getContent: (contentTemplate: string) => {
      switch( contentTemplate ) {
        case "module-companies": {
          return (
            <CompaniesModule
              sceneBlueprint={viewsConfig[contentTemplate].splitTree}
            />
          );
        }
        case "module-analysis": {
          return (
            <AnalysisModule
              sceneBlueprint={viewsConfig[contentTemplate].splitTree}
            />
          );
        };
        case "module-macro": return <>macro module</>;
      }
      return <>FAILED</>;
    }
  };

  return (
    <ModuleView 
      sceneBlueprint={pSceneBlueprint} 
      contentProvider={modulesProvider}
    />
  );
}
