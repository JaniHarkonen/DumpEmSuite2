import useSplitTreeManager, { SplitTreeManagerProps } from "@renderer/hook/useSplitTreeManager";
import { SplitTreeBlueprint } from "@renderer/model/splits";
import { TabContentProvider } from "@renderer/model/tabs";
import SplitView from "../SplitView/SplitView";
import { ReactNode } from "react";


export default function ModuleView(props: SplitTreeManagerProps): ReactNode {
  const pContentProvider: TabContentProvider = props.contentProvider;
  const pSceneBlueprint: SplitTreeBlueprint | null | undefined = props.sceneBlueprint;

  const [splitTree] = useSplitTreeManager({
    contentProvider: pContentProvider,
    sceneBlueprint: pSceneBlueprint
  });

  return <>{splitTree && <SplitView splitTree={splitTree} />}</>;
}
