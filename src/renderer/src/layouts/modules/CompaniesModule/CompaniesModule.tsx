import ModuleView, { ModuleProps } from "@renderer/components/ModuleView/ModuleView";
import { SplitTreeBlueprint } from "@renderer/model/splits";
import { TabContentProvider } from "@renderer/model/tabs";


export default function CompaniesModule(props: ModuleProps) {
  const pSceneBlueprint: SplitTreeBlueprint = props.sceneBlueprint;

  const contentProvider: TabContentProvider = {
    getContent: (contentTemplate: string) => {
      switch(contentTemplate) {
        case "tab-scraper": return <>tab-scraper</>;
        case "tab-listings": return <>tab-listings</>;
        case "tab-profiles": return <>tab-profiles</>;
      }
      return <>FAILED</>;
    }
  };

  return (
    <ModuleView
      sceneBlueprint={pSceneBlueprint}
      contentProvider={contentProvider}
    />
  );
}
