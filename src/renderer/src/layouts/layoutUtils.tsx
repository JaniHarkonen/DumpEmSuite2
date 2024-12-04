import { SceneContext } from "@renderer/context/SceneContext";
import { defaultSceneConfigBlueprint, TabBlueprint, TabContentProvider } from "@renderer/model/tabs";
import { ReactNode } from "react";


type ProplessElementConstructor = () => ReactNode;

export type TemplateContentMappings = {
  [key in string]: ProplessElementConstructor;
}

export function createTabContentProvider(
  mappings: TemplateContentMappings,
  defaultTemplate: ReactNode
): TabContentProvider {
  return {
    getContent: (tabBlueprint: TabBlueprint): ReactNode => {
      if( !tabBlueprint.contentTemplate ) {
        return null;
      }
      
      const Template: ProplessElementConstructor = mappings[tabBlueprint.contentTemplate];

      return (
        <SceneContext.Provider value={{
          sceneConfig: tabBlueprint.sceneConfigBlueprint || defaultSceneConfigBlueprint()
        }}>
          {(Template && <Template />) || defaultTemplate}
        </SceneContext.Provider>
      );
    }
  };
}
