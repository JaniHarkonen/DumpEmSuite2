import { GlobalContext } from "@renderer/context/GlobalContext";
import { SceneContext } from "@renderer/context/SceneContext";
import { SplitTreeBlueprint } from "@renderer/model/splits";
import { SceneConfigBlueprint } from "@renderer/model/tabs";
import { useContext } from "react";


type OnSceneSplitTreeUpdate = (blueprint: SplitTreeBlueprint) => void;
type Returns = {
  sceneConfig: SceneConfigBlueprint;
  handleSplitTreeUpdate: OnSceneSplitTreeUpdate;
};

export default function useSceneConfig(): Returns {
  const {config} = useContext(GlobalContext);
  const {sceneConfig} = useContext(SceneContext);

  const handleSplitTreeUpdate: OnSceneSplitTreeUpdate = (blueprint: SplitTreeBlueprint) => {
    sceneConfig.splitTree.root = blueprint.root;

    if( config.appStateConfigRef && config.appStateConfigRef.current ) {
      config.configFileUpdater(config.appStateConfigRef.current);
    }
  };

  
  return {
    sceneConfig,
    handleSplitTreeUpdate
  };
}
