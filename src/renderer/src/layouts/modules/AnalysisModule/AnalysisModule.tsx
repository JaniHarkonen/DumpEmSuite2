import { createTabContentProvider } from "@renderer/layouts/layoutUtils";
import { TabContentProvider } from "@renderer/model/tabs";
import { ReactNode } from "react";
import AnalysesView from "@renderer/layouts/modules/AnalysisModule/AnalysesView/AnalysesView";
import useSceneConfig from "@renderer/hook/useSceneConfig";
import FilterationView from "./FilterationView/FilterationView";


export default function AnalysisModule(): ReactNode {
  const {sceneConfig, handleSplitTreeUpdate} = useSceneConfig();

  const tabsProvider: TabContentProvider = createTabContentProvider(
    sceneConfig.tabs!, 
    { "view-fundamental": () => <>view-fundamental</> },
    <FilterationView />
  );

  
  return (
    <AnalysesView
      splitTreeBlueprint={sceneConfig.splitTree}
      contentProvider={tabsProvider}
      onUpdate={handleSplitTreeUpdate}
    />
  );
}
