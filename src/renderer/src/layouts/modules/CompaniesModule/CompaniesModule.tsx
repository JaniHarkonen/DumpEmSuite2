import ModuleView from "@renderer/components/ModuleView/ModuleView";
import { SplitTreeBlueprint } from "@renderer/model/splits";
import { TabContentProvider } from "@renderer/model/tabs";


const CONTENT_PROVIDER: TabContentProvider = {
  getContent: (contentTemplate: string) => {
    switch(contentTemplate) {
      case "tab-scraper": return <>tab-scraper</>;
      case "tab-listings": return <>tab-listings</>;
      case "tab-profiles": return <>tab-profiles</>;
    }
    return <>FAILED</>;
  }
};

type Props = {
  sceneBlueprint: SplitTreeBlueprint;
};

export default function CompaniesModule(props: Props) {
  const pSceneBlueprint: SplitTreeBlueprint = props.sceneBlueprint;

  return (
    <ModuleView
      sceneBlueprint={pSceneBlueprint}
      contentProvider={CONTENT_PROVIDER}
    />
  );
}
