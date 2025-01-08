import useSceneConfig from "@renderer/hook/useSceneConfig";
import ModuleView from "@renderer/layouts/modules/ModuleView/ModuleView";
import { defaultSceneConfigBlueprint, TabBlueprint, TabContentProvider } from "@renderer/model/tabs";
import { ReactNode } from "react";
import Workspace from "../Workspace";
import { SceneContext } from "@renderer/context/SceneContext";


export default function WorkspacesView(): ReactNode {
  const {sceneConfig, handleSplitTreeUpdate} = useSceneConfig();

  const tabsProvider: TabContentProvider = {
    getContent: (tabBlueprint: TabBlueprint) => (
      <SceneContext.Provider value={{
        sceneConfig: tabBlueprint.sceneConfigBlueprint || defaultSceneConfigBlueprint()
      }}>
        <Workspace />
      </SceneContext.Provider>
    )
  };
  
  return (
    <ModuleView
      splitTreeBlueprint={sceneConfig.splitTree}
      contentProvider={tabsProvider}
      onUpdate={handleSplitTreeUpdate}
    />
  );
}
