import ModuleView from "@renderer/components/ModuleView/ModuleView";
import { SceneContext } from "@renderer/context/SceneContext";
import { createTabContentProvider } from "@renderer/layouts/layoutUtils";
import { SceneTabsConfig } from "@renderer/model/config";
import { SplitTreeBlueprint } from "@renderer/model/splits";
import { TabContentProvider } from "@renderer/model/tabs";
import { ReactNode, useContext } from "react";


export default function AnalysisModule(): ReactNode {
  const {sceneConfig} = useContext(SceneContext);
  const sceneBlueprint: SplitTreeBlueprint = sceneConfig.splitTree;
  const tabsConfig: SceneTabsConfig = sceneConfig.tabs!;


  const tabsProvider: TabContentProvider = createTabContentProvider(
    tabsConfig, 
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
    <ModuleView
      sceneBlueprint={sceneBlueprint}
      contentProvider={tabsProvider}
    />
  );
}
