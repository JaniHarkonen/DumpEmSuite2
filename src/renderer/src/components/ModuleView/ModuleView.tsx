import { SplitTreeBlueprint } from "@renderer/model/splits";
import { TabContentProvider } from "@renderer/model/tabs";
import SplitView from "../SplitView/SplitView";
import { ReactNode } from "react";
import { FlexibleSplitsContext } from "@renderer/context/FlexibleSplitsContext";
import useFlexibleSplits, { UseFlexibleSplitsProps } from "@renderer/hook/useFlexibleSplits";


export default function ModuleView(props: UseFlexibleSplitsProps): ReactNode {
  const pSceneBlueprint: SplitTreeBlueprint | null | undefined = props.splitTreeBlueprint;
  const pContentProvider: TabContentProvider = props.contentProvider;

  const {
    splitTree: liveSplitTree, 
    tabSelection, 
    handleTabSelection, 
    handleTabOpen,
    handleTabRelocation, 
    handleTabSplit,
    handleDividerMove,
    handleTabAdd,
    handleTabRemove
  } = useFlexibleSplits({
    splitTreeBlueprint: pSceneBlueprint,
    contentProvider: pContentProvider
  });

  
  return (
    <FlexibleSplitsContext.Provider
      value={{
        splitTree: liveSplitTree, 
        tabSelection, 
        handleTabSelection, 
        handleTabOpen,
        handleTabRelocation, 
        handleTabSplit,
        handleDividerMove,
        handleTabAdd,
        handleTabRemove
      }}
    >
      {liveSplitTree && <SplitView />}
    </FlexibleSplitsContext.Provider>
  );
}
