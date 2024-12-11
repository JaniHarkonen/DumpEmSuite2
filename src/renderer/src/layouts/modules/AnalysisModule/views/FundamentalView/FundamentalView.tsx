import useSceneConfig from "@renderer/hook/useSceneConfig";
import { createTabContentProvider } from "@renderer/layouts/layoutUtils";
import { ReactNode, useContext } from "react";
import { SceneContext } from "@renderer/context/SceneContext";
import { SplitTreeBlueprint } from "@renderer/model/splits";
import { TabContentProvider } from "@renderer/model/tabs";
import useProfileSelection from "@renderer/hook/useProfileSelection";
import { ProfileContext } from "@renderer/context/ProfileContext";
import CompanyAnalysisList from "@renderer/components/CompanyList/CompanyAnalysisList/CompanyAnalysisList";
import CompanyProfile from "@renderer/components/CompanyProfile/CompanyProfile";
import ModuleView from "@renderer/layouts/modules/ModuleView/ModuleView";
import { TabsContext } from "@renderer/context/TabsContext";


export default function FundamentalView(): ReactNode {
  const {handleSplitTreeUpdate} = useSceneConfig();
  const {profileSelection, handleProfileSelection} = useProfileSelection();
  const {sceneConfig} = useContext(SceneContext);

  const {tabs, activeTabIndex} = useContext(TabsContext);
  const sceneBlueprint: SplitTreeBlueprint = sceneConfig?.splitTree;

  const tabsProvider: TabContentProvider = createTabContentProvider(
    {
      "view-filteration-tab-stocks": () => {
        return (
          <CompanyAnalysisList
            filterationStepID={tabs[activeTabIndex].id}
            onCompanySelect={handleProfileSelection}
          />
        )
      },
      "view-filteration-tab-chart": () => <>chart</>,
      "view-fundamental-notes": () => <>fundamental</>,
      "view-material-browser": () => <>materials</>,
      "view-company-profile": () => <CompanyProfile />
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
