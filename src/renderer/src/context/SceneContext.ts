import { defaultSceneConfigBlueprint, SceneConfigBlueprint } from "@renderer/model/tabs";
import { createContext } from "react";


type SceneContextType = {
  sceneConfig: SceneConfigBlueprint;
};

export const SceneContext = createContext<SceneContextType>({
  sceneConfig: defaultSceneConfigBlueprint()
});
