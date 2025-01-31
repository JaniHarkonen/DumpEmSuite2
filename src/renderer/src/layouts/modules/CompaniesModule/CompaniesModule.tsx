import { SceneContext } from "@renderer/context/SceneContext";
import { createTabContentProvider } from "@renderer/layouts/layoutUtils";
import { SplitTreeBlueprint } from "@renderer/model/splits";
import { TabContentProvider } from "@renderer/model/tabs";
import { ReactNode, useContext } from "react";
import useSceneConfig from "@renderer/hook/useSceneConfig";
import ProfilesView from "./views/ProfilesView/ProfilesView";
import ListingsView from "./views/ListingsView/ListingsView";
import ModuleView from "../../ModuleView/ModuleView";
import ScraperView from "./views/ScraperView/ScraperView";


export default function CompaniesModule(): ReactNode {
  const {sceneConfig} = useContext(SceneContext);
  const {handleSplitTreeUpdate} = useSceneConfig();

  const sceneBlueprint: SplitTreeBlueprint = sceneConfig.splitTree;

  const tabsProvider: TabContentProvider = createTabContentProvider(
    {
      "view-scraper": () => <ScraperView />,
      "view-listings": () => <ListingsView />,
      "view-profiles": () => <ProfilesView />
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
