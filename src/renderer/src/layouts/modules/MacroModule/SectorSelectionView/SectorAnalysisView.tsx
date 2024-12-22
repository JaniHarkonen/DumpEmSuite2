import MarkdownEditor from "@renderer/components/MarkdownEditor/MarkdownEditor";
import useSceneConfig from "@renderer/hook/useSceneConfig";
import { createTabContentProvider } from "@renderer/layouts/layoutUtils";
import { SplitTreeBlueprint } from "@renderer/model/splits";
import { TabContentProvider } from "@renderer/model/tabs";
import { ReactNode } from "react";
import ModuleView from "../../ModuleView/ModuleView";


export default function SectorAnalysisView(): ReactNode {
  const {sceneConfig, handleSplitTreeUpdate} = useSceneConfig();
  const sceneBlueprint: SplitTreeBlueprint = sceneConfig.splitTree;

  const tabsProvider: TabContentProvider = createTabContentProvider(
    {
      "view-sector-tab-notes": () => <MarkdownEditor />,
      "view-sector-tab-materials": () => <>materials</>
    },
    <>failed</>
  );


  return (
    <ModuleView
      splitTreeBlueprint={sceneBlueprint}
      contentProvider={tabsProvider}
      onUpdate={handleSplitTreeUpdate}
    />
  );
}
