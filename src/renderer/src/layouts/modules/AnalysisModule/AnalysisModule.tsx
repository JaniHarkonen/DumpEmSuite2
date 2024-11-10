import ModuleView from "@renderer/components/ModuleView/ModuleView";
import { SplitTreeBlueprint } from "@renderer/model/splits";
import { TabContentProvider } from "@renderer/model/tabs";
import { ReactNode } from "react";


type Props = {
  sceneBlueprint: SplitTreeBlueprint;
};

export default function AnalysisModule(props: Props): ReactNode {
  const pSceneBlueprint: SplitTreeBlueprint = props.sceneBlueprint;
  const contentProvider: TabContentProvider = {
    getContent: (contentTemplate: string) => {
      switch( contentTemplate ) {
        case "tab-volume": return <>tab-volume</>;
        case "tab-price-action": return <>tab-price-action</>;
        case "tab-technical": return <>tab-technical</>;
        case "tab-fundamental": return <>tab-fundamental</>;
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
