import { SceneContext } from "@renderer/context/SceneContext";
import { SceneTabsConfig } from "@renderer/model/config";
import { Tab, TabBlueprint, TabContentProvider } from "@renderer/model/tabs";
import { ReactNode } from "react";


type ProplessElementConstructor = () => ReactNode;

export type TemplateContentMappings = {
  [key in string]: ProplessElementConstructor;
}

export function createTabContentProvider(
  tabConfigurations: SceneTabsConfig,
  mappings: TemplateContentMappings,
  defaultTemplate: ReactNode
): TabContentProvider {
  return {
    getContent: (tab: Tab | TabBlueprint): ReactNode => {
      if( !tab.contentTemplate ) {
        return null;
      }
      
      const Template: ProplessElementConstructor = mappings[tab.contentTemplate];
      console.log(tabConfigurations[tab.contentTemplate], tab.contentTemplate)
      return (
        <SceneContext.Provider value={{ sceneConfig: tabConfigurations[tab.contentTemplate] }}>
          {(Template && <Template />) || defaultTemplate}
        </SceneContext.Provider>
      );
    }
  };
}
