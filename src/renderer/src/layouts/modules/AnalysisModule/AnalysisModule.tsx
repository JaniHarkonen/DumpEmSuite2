import { createTabContentProvider } from "@renderer/layouts/layoutUtils";
import { TabContentProvider } from "@renderer/model/tabs";
import { ReactNode } from "react";
import AnalysesView from "@renderer/layouts/modules/AnalysisModule/AnalysesView/AnalysesView";
import useSceneConfig from "@renderer/hook/useSceneConfig";
import FilterationView from "./views/FilterationView/FilterationView";
import FundamentalView from "./views/FundamentalView/FundamentalView";


export default function AnalysisModule(): ReactNode {
  const {sceneConfig, handleSplitTreeUpdate} = useSceneConfig();

  const tabsProvider: TabContentProvider = createTabContentProvider(
    { "view-fundamental": () => <FundamentalView /> },
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
