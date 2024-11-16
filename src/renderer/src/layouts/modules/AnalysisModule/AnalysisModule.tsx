import { createTabContentProvider } from "@renderer/layouts/layoutUtils";
import { TabContentProvider } from "@renderer/model/tabs";
import { ReactNode } from "react";
import AnalysesView from "@renderer/layouts/modules/AnalysisModule/AnalysesView/AnalysesView";
import useSceneConfig from "@renderer/hook/useSceneConfig";


export default function AnalysisModule(): ReactNode {
  const {sceneConfig, handleSplitTreeUpdate} = useSceneConfig();

  const tabsProvider: TabContentProvider = createTabContentProvider(
    sceneConfig.tabs!, 
    {
      "tab-volume": () => <>tab-volume</>,
      "tab-price-action": () => <>tab-price-action</>,
      "tab-technical": () => <>tab-technical</>,
      "add-filteration-tab": () => <>add-filteration-tab</>,
      "tab-fundamental": () => <>tab-fundamental</>
    },
    <>FAILED</>
  );

  
  return (
    <AnalysesView
      splitTreeBlueprint={sceneConfig.splitTree}
      contentProvider={tabsProvider}
      onUpdate={handleSplitTreeUpdate}
    />
  );
}
