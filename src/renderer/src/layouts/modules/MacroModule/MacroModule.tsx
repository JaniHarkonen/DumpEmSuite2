import useSceneConfig from "@renderer/hook/useSceneConfig";
import { createTabContentProvider } from "@renderer/layouts/layoutUtils";
import { TabContentProvider } from "@renderer/model/tabs";
import { ReactNode } from "react";
import { SplitTreeBlueprint } from "@renderer/model/splits";
import SectorSelectionView from "./SectorView/SectorSelectionView";
import SectorAnalysisView from "./SectorSelectionView/SectorAnalysisView";


export default function MacroModule(): ReactNode {
  const {sceneConfig, handleSplitTreeUpdate} = useSceneConfig();
  const sceneBlueprint: SplitTreeBlueprint = sceneConfig.splitTree;

  const tabsProvider: TabContentProvider = createTabContentProvider(
    { "view-sector-analysis": () => <SectorAnalysisView /> }, <>failed</>
  );
  

  return (
    <SectorSelectionView
      splitTreeBlueprint={sceneBlueprint}
      contentProvider={tabsProvider}
      onUpdate={handleSplitTreeUpdate}
    />
  );
}
