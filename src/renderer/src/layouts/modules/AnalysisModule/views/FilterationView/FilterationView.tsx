import { SceneContext } from "@renderer/context/SceneContext";
import useSceneConfig from "@renderer/hook/useSceneConfig";
import { createTabContentProvider } from "@renderer/layouts/layoutUtils";
import { SplitTreeBlueprint } from "@renderer/model/splits";
import { TabContentProvider } from "@renderer/model/tabs";
import { useContext } from "react";
import CompanyAnalysisList from "@renderer/components/CompanyList/CompanyAnalysisList/CompanyAnalysisList";
import ModuleView from "@renderer/layouts/ModuleView/ModuleView";
import { TabsContext } from "@renderer/context/TabsContext";
import FilterationNote from "../FilterationNote/FiltrationNote";
import useProfileSelection from "@renderer/hook/useProfileSelection";
import { ProfileContext } from "@renderer/context/ProfileContext";
import ProfileChart from "@renderer/components/tradingview/ProfileChart";
import FiltrationNote from "../FilterationNote/FiltrationNote";


export default function FilterationView() {
  const {handleSplitTreeUpdate} = useSceneConfig();
  const {profileSelection, handleProfileSelection} = useProfileSelection();

  const {sceneConfig} = useContext(SceneContext);
  const {tabs, activeTabIndex} = useContext(TabsContext);
  
  const sceneBlueprint: SplitTreeBlueprint = sceneConfig?.splitTree;
  const filterationStepID: string = tabs[activeTabIndex].id || "";

  const tabsProvider: TabContentProvider = createTabContentProvider(
     {
      "view-filteration-tab-stocks": () => {
        return (
          <CompanyAnalysisList
            filterationStepID={tabs[activeTabIndex].id}
            allowSubmit={true}
            onCompanySelect={handleProfileSelection}
          />
        );
      },
      "view-filteration-tab-chart": () => <ProfileChart />,
      "view-filteration-tab-notes": () => <FiltrationNote filtrationStepID={filterationStepID} />
    }
  );

  return (
    <ProfileContext.Provider value={profileSelection}>
      <ModuleView
        splitTreeBlueprint={sceneBlueprint}
        contentProvider={tabsProvider}
        onUpdate={handleSplitTreeUpdate}
      />
    </ProfileContext.Provider>
  );
}
