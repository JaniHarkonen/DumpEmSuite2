import { SceneContext } from "@renderer/context/SceneContext";
import useSceneConfig from "@renderer/hook/useSceneConfig";
import { createTabContentProvider } from "@renderer/layouts/layoutUtils";
import { SplitTreeBlueprint } from "@renderer/model/splits";
import { Tab, TabContentProvider } from "@renderer/model/tabs";
import { useContext } from "react";
import CompanyAnalysisList from "@renderer/components/CompanyList/CompanyAnalysisList/CompanyAnalysisList";
import ModuleView from "@renderer/layouts/modules/ModuleView/ModuleView";
import { TabInfoContext } from "@renderer/context/TabInfoContext";


export default function FilterationView() {
  const {handleSplitTreeUpdate} = useSceneConfig();
  const {sceneConfig} = useContext(SceneContext);

  const currentTab: Tab = useContext(TabInfoContext).currentTab!;
  const sceneBlueprint: SplitTreeBlueprint = sceneConfig?.splitTree;

  const tabsProvider: TabContentProvider = createTabContentProvider(
     {
      "view-filteration-tab-stocks": () => {
        return (
          <CompanyAnalysisList filterationStepID={currentTab.id} />
        );
      },
      "view-filteration-tab-chart": () => <>chart</>,
      "view-filteration-tab-notes": () => <>notes</>
    }
  );


  return (
    <ModuleView
      splitTreeBlueprint={sceneBlueprint}
      contentProvider={tabsProvider}
      onUpdate={handleSplitTreeUpdate}
    />
  );
}
