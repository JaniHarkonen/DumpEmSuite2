import useSceneConfig from "@renderer/hook/useSceneConfig";
import { createTabContentProvider } from "@renderer/layouts/layoutUtils";
import { SplitTreeBlueprint } from "@renderer/model/splits";
import { Tab, TabContentProvider } from "@renderer/model/tabs";
import { ReactNode, useContext } from "react";
import ModuleView from "../../ModuleView/ModuleView";
import MacroSectorNotesView from "../views/MacroSectorNotesView";
import { TabsContext } from "@renderer/context/TabsContext";
import MaterialsBrowser from "@renderer/components/MaterialsBrowser/MaterialsBrowser";
import { WorkspaceContext } from "@renderer/context/WorkspaceContext";
import { RELATIVE_APP_PATHS } from "../../../../../../../src/shared/appConfig";


export default function SectorAnalysisView(): ReactNode {
  const {sceneConfig, handleSplitTreeUpdate} = useSceneConfig();
  const {activeTabIndex, tabs} = useContext(TabsContext);
  const {workspacePath} = useContext(WorkspaceContext);

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
      "view-sector-tab-materials": () => {
        return (
          <MaterialsBrowser
            directoryPath={RELATIVE_APP_PATHS.make.sector(workspacePath!, activeTab.id)}
          />
        );
      }
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
