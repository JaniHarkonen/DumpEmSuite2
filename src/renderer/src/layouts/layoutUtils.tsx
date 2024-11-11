import { SceneContext } from "@renderer/context/SceneContext";
import { SceneTabsConfig } from "@renderer/model/config";
import { TabContentProvider } from "@renderer/model/tabs";
import { ReactNode } from "react";

type ProplessElementConstructor = () => ReactNode;

export type TemplateContentMappings = {
  [key in string]: ProplessElementConstructor;
}

/**
 * Utility function for creating a typical TabContentProvider that produces ReactNodes
 * of content templates for tabs as they are populated when building a SplitTree. All
 * content templates will be wrapped inside a SceneContext-provider that embues the 
 * template with its proper context (split tree blueprint and tab config). 
 * 
 * The function produces a TabContentProvider whose getContent()-function will return
 * a template (ReactNode) that corresponds to the given mappings. If no corresponding
 * template exists, the default template will be returned.
 * 
 * @param tabConfigurations Tab configuration that will be injected to the template 
 * by wrapping it within a SceneContex.
 * 
 * @param mappings Mappings of content template strings to their corresponding template
 * constructor functions. These should be propless.
 * 
 * @param defaultTemplate Default template (ReactNode) that will be returned by the 
 * TabContentProvider, if the content template string given to it cannot be mapped to 
 * a template.
 * 
 * @returns A TabContentProvider-object with a getContent()-function.
 */
export function createTabContentProvider(
  tabConfigurations: SceneTabsConfig,
  mappings: TemplateContentMappings,
  defaultTemplate: ReactNode
): TabContentProvider {
  return {
    getContent: (contentTemplate: string | null): ReactNode => {
      if( !contentTemplate ) {
        return null;
      }
      
      const Template: ProplessElementConstructor = mappings[contentTemplate];
      return (
        <SceneContext.Provider value={{ sceneConfig: tabConfigurations[contentTemplate] }}>
          {(Template && <Template />) || defaultTemplate}
        </SceneContext.Provider>
      );
    }
  };
}
