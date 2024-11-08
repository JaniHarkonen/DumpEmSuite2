import ModuleView from "@renderer/components/ModuleView/ModuleView";
import { SplitTreeBlueprint } from "@renderer/model/splits";
import { TabContentProvider } from "@renderer/model/tabs";
import { ReactNode, useContext } from "react";
import CompaniesModule from "../modules/CompaniesModule/CompaniesModule";
import { GlobalContext } from "@renderer/context/GlobalContext";
import { WorkspaceViewsConfig } from "@renderer/model/config";
import AnalysisModule from "../modules/AnalysisModule/AnalysisModule";


type Props = {
  sceneBlueprint: SplitTreeBlueprint | null;
};

export default function Workspace(props: Props): ReactNode {
  const pSceneBlueprint: SplitTreeBlueprint | null = props.sceneBlueprint;

  const {config} = useContext(GlobalContext);
  const configuration = config.configuration!;
  const viewsConfig: WorkspaceViewsConfig = 
    configuration.workspaces[configuration.activeWorkspaceIndex].scene.views;

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
