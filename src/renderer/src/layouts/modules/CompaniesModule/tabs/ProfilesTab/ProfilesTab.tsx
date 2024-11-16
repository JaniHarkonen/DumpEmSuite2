import CompanyList from "@renderer/components/CompanyList/CompanyList";
import ModuleView from "@renderer/components/ModuleView/ModuleView";
import { SceneContext } from "@renderer/context/SceneContext";
import { SplitTreeBlueprint } from "@renderer/model/splits";
import { TabContentProvider } from "@renderer/model/tabs";
import { useContext } from "react";


export default function ProfilesTab() {
  const {sceneConfig} = useContext(SceneContext);
  const sceneBlueprint: SplitTreeBlueprint = sceneConfig.splitTree;
  // const tabsConfig: SceneTabsConfig = sceneConfig.tabs!;

  const tabsProvider: TabContentProvider = {
    getContent: (contentTemplate: string | null) => {
      switch( contentTemplate ) {
        case "view-company-list": return <CompanyList />;
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
    />
  );
}
