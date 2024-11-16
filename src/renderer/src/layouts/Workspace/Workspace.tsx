import ModuleView from "@renderer/components/ModuleView/ModuleView";
import { TabContentProvider } from "@renderer/model/tabs";
import { ReactNode } from "react";
import CompaniesModule from "../modules/CompaniesModule/CompaniesModule";
import AnalysisModule from "../modules/AnalysisModule/AnalysisModule";
import { createTabContentProvider } from "../layoutUtils";
import useSceneConfig from "@renderer/hook/useSceneConfig";


export default function Workspace(): ReactNode {
  const {sceneConfig, handleSplitTreeUpdate} = useSceneConfig();

  const modulesProvider: TabContentProvider = createTabContentProvider(
    sceneConfig.tabs!, 
    {
      "module-companies": () => <CompaniesModule />,
      "module-analysis": () => <AnalysisModule />,
      "module-macro": () => <>macro module</>
    },
    <>FAILED</>
  );

  
  return (
    <ModuleView 
      splitTreeBlueprint={sceneConfig.splitTree} 
      contentProvider={modulesProvider}
      onUpdate={handleSplitTreeUpdate}
    />
  );
}
