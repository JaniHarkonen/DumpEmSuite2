import ModuleView from "@renderer/components/ModuleView/ModuleView";
import { SceneContext } from "@renderer/context/SceneContext";
import { SplitTreeBlueprint } from "@renderer/model/splits";
import { TabContentProvider } from "@renderer/model/tabs";
import { useContext } from "react";
import CompanyProfilesList from "@renderer/components/TableList/CompanyProfilesList/CompanyProfilesList";
import useSceneConfig from "@renderer/hook/useSceneConfig";


export default function ProfilesTab() {
  const {sceneConfig} = useContext(SceneContext);
  const sceneBlueprint: SplitTreeBlueprint = sceneConfig.splitTree;
  const {handleSplitTreeUpdate} = useSceneConfig();
  // const tabsConfig: SceneTabsConfig = sceneConfig.tabs!;

  const tabsProvider: TabContentProvider = {
    getContent: (contentTemplate: string | null) => {
      switch( contentTemplate ) {
        case "view-company-list": return <CompanyProfilesList />;
        case "view-chart": return <>chart</>;
        case "view-company-profile": return <>profile</>;
      }
      return <>failed</>;
    }
  }


  return (
    <ModuleView
      splitTreeBlueprint={sceneBlueprint}
      contentProvider={tabsProvider}
      onUpdate={handleSplitTreeUpdate}
    />
  );
}
