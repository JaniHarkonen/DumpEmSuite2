
import { SceneContext } from "@renderer/context/SceneContext";
import { createTabContentProvider } from "@renderer/layouts/layoutUtils";
import { SplitTreeBlueprint } from "@renderer/model/splits";
import { TabContentProvider } from "@renderer/model/tabs";
import { ReactNode, useContext } from "react";
import ScraperTab from "./views/ScraperTab/ScraperTab";
import useSceneConfig from "@renderer/hook/useSceneConfig";
import ProfilesView from "./views/ProfilesView/ProfilesView";
import ListingsView from "./views/ListingsView/ListingsView";
import ModuleView from "../ModuleView/ModuleView";


export default function CompaniesModule(): ReactNode {
  const {sceneConfig} = useContext(SceneContext);
  const sceneBlueprint: SplitTreeBlueprint = sceneConfig.splitTree;
  const {handleSplitTreeUpdate} = useSceneConfig();

  const tabsProvider: TabContentProvider = createTabContentProvider(
    {
      "tab-scraper": () => <ScraperTab />,
      "tab-listings": () => <ListingsView />,
      "tab-profiles": () => <ProfilesView />
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
