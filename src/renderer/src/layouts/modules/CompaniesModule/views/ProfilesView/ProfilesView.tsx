import { SceneContext } from "@renderer/context/SceneContext";
import { SplitTreeBlueprint } from "@renderer/model/splits";
import { TabContentProvider } from "@renderer/model/tabs";
import { useContext } from "react";
import useSceneConfig from "@renderer/hook/useSceneConfig";
import CompanyProfile from "@renderer/components/CompanyProfile/CompanyProfile";
import { ProfileContext } from "@renderer/context/ProfileContext";
import { createTabContentProvider } from "@renderer/layouts/layoutUtils";
import useProfileSelection from "@renderer/hook/useProfileSelection";
import CompanyProfilesList from "@renderer/components/CompanyList/CompanyProfilesList/CompanyProfilesList";
import ModuleView from "@renderer/layouts/ModuleView/ModuleView";
import ProfileChart from "@renderer/components/tradingview/ProfileChart";


export default function ProfilesView() {
  const {handleSplitTreeUpdate} = useSceneConfig();
  const {sceneConfig} = useContext(SceneContext);
  const sceneBlueprint: SplitTreeBlueprint = sceneConfig.splitTree;
  const {
    profileSelection,
    handleProfileSelection
  } = useProfileSelection();

  const tabsProvider: TabContentProvider = createTabContentProvider(
    {
      "view-company-list": () => <CompanyProfilesList onCompanySelect={handleProfileSelection} />,
      "view-chart": () => <ProfileChart />,
      "view-company-profile": () => <CompanyProfile allowEdit={true} />
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
