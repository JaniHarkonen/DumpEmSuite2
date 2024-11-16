import { GlobalContext } from "@renderer/context/GlobalContext";
import { SceneContext } from "@renderer/context/SceneContext";
import { SceneConfig } from "@renderer/model/config";
import { SplitTreeBlueprint } from "@renderer/model/splits";
import { useContext } from "react";


type OnSceneSplitTreeUpdate = (blueprint: SplitTreeBlueprint) => void;
type Returns = {
  sceneConfig: SceneConfig;
  handleSplitTreeUpdate: OnSceneSplitTreeUpdate;
};

export default function useSceneConfig(): Returns {
  const {config} = useContext(GlobalContext);
  const {sceneConfig} = useContext(SceneContext);

  const handleSplitTreeUpdate: OnSceneSplitTreeUpdate = (blueprint: SplitTreeBlueprint) => {
    sceneConfig.splitTree = blueprint;

    if( config.appStateConfigRef && config.appStateConfigRef.current ) {
      config.configFileUpdater(config.appStateConfigRef.current);
    }
  };

  
  return {
    sceneConfig,
    handleSplitTreeUpdate
  };
}
