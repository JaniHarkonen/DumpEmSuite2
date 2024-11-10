import ModuleView from "@renderer/components/ModuleView/ModuleView";
import { SceneContext } from "@renderer/context/SceneContext";
import { createTabContentProvider } from "@renderer/layouts/layoutUtils";
import { SceneTabsConfig } from "@renderer/model/config";
import { SplitTreeBlueprint } from "@renderer/model/splits";
import { TabContentProvider } from "@renderer/model/tabs";
import { ReactNode, useContext } from "react";
import ListingsTab from "./tabs/ListingsTab/ListingsTab";
import ProfilesTab from "./tabs/ProfilesTab/ProfilesTab";
import ScraperTab from "./tabs/ScraperTab/ScraperTab";


export default function CompaniesModule(): ReactNode {
  const {sceneConfig} = useContext(SceneContext);
  const sceneBlueprint: SplitTreeBlueprint = sceneConfig.splitTree;
  const tabsConfig: SceneTabsConfig = sceneConfig.tabs!;


  const tabsProvider: TabContentProvider = createTabContentProvider(
    tabsConfig, 
    {
      "tab-scraper": () => <ScraperTab />,
      "tab-listings": () => <ListingsTab />,
      "tab-profiles": () => <ProfilesTab />
    },
    <>FAILED</>
  );


  return (
    <ModuleView
      sceneBlueprint={sceneBlueprint}
      contentProvider={tabsProvider}
    />
  );
}
