import useSceneConfig from "@renderer/hook/useSceneConfig";
import { createTabContentProvider } from "@renderer/layouts/layoutUtils";
import { SplitTreeBlueprint } from "@renderer/model/splits";
import { Tab, TabContentProvider } from "@renderer/model/tabs";
import { ReactNode, useContext } from "react";
import ModuleView from "../../ModuleView/ModuleView";
import MacroSectorNotesView from "../views/MacroSectorNotesView";
import { TabsContext } from "@renderer/context/TabsContext";


export default function SectorAnalysisView(): ReactNode {
  const {sceneConfig, handleSplitTreeUpdate} = useSceneConfig();
  const {activeTabIndex, tabs} = useContext(TabsContext);

  const activeTab: Tab = tabs[activeTabIndex];
  const sceneBlueprint: SplitTreeBlueprint = sceneConfig.splitTree;

  const tabsProvider: TabContentProvider = createTabContentProvider(
    {
      "view-sector-tab-notes": () => {
        return (
          <MacroSectorNotesView macroSector={{
            sector_id: activeTab.id, 
            sector_name: activeTab.caption 
          }}/>
        );
      },
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
