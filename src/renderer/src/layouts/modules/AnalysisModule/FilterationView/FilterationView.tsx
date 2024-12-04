import CompanyAnalysisList from "@renderer/components/CompanyAnalysisList/CompanyAnalysisList";
import { SceneContext } from "@renderer/context/SceneContext";
import useSceneConfig from "@renderer/hook/useSceneConfig";
import { createTabContentProvider } from "@renderer/layouts/layoutUtils";
import { SplitTreeBlueprint } from "@renderer/model/splits";
import { TabContentProvider } from "@renderer/model/tabs";
import { useContext } from "react";
import ModuleView from "@renderer/components/ModuleView/ModuleView";


export default function FilterationView() {
  const {sceneConfig} = useContext(SceneContext);
  const sceneBlueprint: SplitTreeBlueprint = sceneConfig?.splitTree;
  const {handleSplitTreeUpdate} = useSceneConfig();

  const tabsProvider: TabContentProvider = createTabContentProvider(
    {
      "view-filteration-tab-stocks": () => <CompanyAnalysisList />,
      "view-filteration-tab-chart": () => <>chart</>,
      "view-filteration-tab-notes": () => <>notes</>
    },
    <>FAILED</>
  );


  return (
    <ModuleView
      splitTreeBlueprint={sceneBlueprint}
      contentProvider={tabsProvider}
      onUpdate={handleSplitTreeUpdate}
    />
  );
}
