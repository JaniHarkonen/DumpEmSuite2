import ModuleView from "@renderer/components/ModuleView/ModuleView";
import { SceneContext } from "@renderer/context/SceneContext";
import { createTabContentProvider } from "@renderer/layouts/layoutUtils";
import { SplitTreeBlueprint } from "@renderer/model/splits";
import { TabContentProvider } from "@renderer/model/tabs";
import { ReactNode, useContext } from "react";
import ListingsTab from "./tabs/ListingsTab/ListingsTab";
import ProfilesTab from "./tabs/ProfilesTab/ProfilesTab";
import ScraperTab from "./tabs/ScraperTab/ScraperTab";
import useSceneConfig from "@renderer/hook/useSceneConfig";


export default function CompaniesModule(): ReactNode {
  const {sceneConfig} = useContext(SceneContext);
  const sceneBlueprint: SplitTreeBlueprint = sceneConfig.splitTree;
  const {handleSplitTreeUpdate} = useSceneConfig();

  const tabsProvider: TabContentProvider = createTabContentProvider(
    {
      "tab-scraper": () => <ScraperTab />,
      "tab-listings": () => <ListingsTab />,
      "tab-profiles": () => <ProfilesTab />
    },
    <>FAILED</>
  );


  return (
    <ModuleView
      splitTreeBlueprint={sceneBlueprint}
      contentProvider={tabsProvider}
      onUpdate={handleSplitTreeUpdate}
    />
  );
}
