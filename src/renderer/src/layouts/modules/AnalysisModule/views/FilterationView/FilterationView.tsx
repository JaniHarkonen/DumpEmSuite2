import { SceneContext } from "@renderer/context/SceneContext";
import useSceneConfig from "@renderer/hook/useSceneConfig";
import { createTabContentProvider } from "@renderer/layouts/layoutUtils";
import { SplitTreeBlueprint } from "@renderer/model/splits";
import { TabContentProvider } from "@renderer/model/tabs";
import { useContext } from "react";
import CompanyAnalysisList from "@renderer/components/CompanyList/CompanyAnalysisList/CompanyAnalysisList";
import ModuleView from "@renderer/layouts/modules/ModuleView/ModuleView";
import { TabsContext } from "@renderer/context/TabsContext";
import MarkdownNote from "@renderer/components/MarkdownNote/MarkdownNote";


export default function FilterationView() {
  const {handleSplitTreeUpdate} = useSceneConfig();

  const {sceneConfig} = useContext(SceneContext);
  const {tabs, activeTabIndex} = useContext(TabsContext);
  
  const sceneBlueprint: SplitTreeBlueprint = sceneConfig?.splitTree;

  const tabsProvider: TabContentProvider = createTabContentProvider(
     {
      "view-filteration-tab-stocks": () => {
        return (
          <CompanyAnalysisList
            filterationStepID={tabs[activeTabIndex].id}
            nextStepID={tabs[activeTabIndex + 1]?.id || tabs[activeTabIndex].id}
          />
        );
      },
      "view-filteration-tab-chart": () => <>chart</>,
      "view-filteration-tab-notes": () => <MarkdownNote />
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
