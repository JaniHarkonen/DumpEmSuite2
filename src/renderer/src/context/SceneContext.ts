import { defaultSceneConfig, SceneConfig } from "@renderer/model/config";
import { createContext } from "react";


type SceneContextType = {
  sceneConfig: SceneConfig;
};

export const SceneContext = createContext<SceneContextType>({
  sceneConfig: defaultSceneConfig()
});
