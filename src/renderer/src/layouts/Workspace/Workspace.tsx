import ModuleView from "@renderer/components/ModuleView/ModuleView";
import { TabContentProvider } from "@renderer/model/tabs";
import { ReactNode, useContext } from "react";
import CompaniesModule from "../modules/CompaniesModule/CompaniesModule";
import AnalysisModule from "../modules/AnalysisModule/AnalysisModule";
import { WorkspaceContext } from "@renderer/context/WorkspaceContext";
import { SplitTreeBlueprint } from "@renderer/model/splits";
import { SceneTabsConfig } from "@renderer/model/config";
import { createTabContentProvider } from "../layoutUtils";


export default function Workspace(): ReactNode {
  const {workspaceConfig} = useContext(WorkspaceContext);
  const sceneBluePrint: SplitTreeBlueprint | null = workspaceConfig.scene.splitTree;
  const tabsConfig: SceneTabsConfig = workspaceConfig.scene.tabs!;

  const modulesProvider: TabContentProvider = createTabContentProvider(
    tabsConfig, 
    {
      "module-companies": () => <CompaniesModule />,
      "module-analysis": () => <AnalysisModule />,
      "module-macro": () => <>macro module</>
    },
    <>FAILED</>
  );

  return (
    <ModuleView 
      splitTreeBlueprint={sceneBluePrint} 
      contentProvider={modulesProvider}
    />
  );
}
