import { SplitTreeBlueprint, SplitTreeValue } from "@renderer/model/splits";
import { Tab, TabContentProvider } from "@renderer/model/tabs";

import { ReactNode } from "react";
import { FlexibleSplitsContext } from "@renderer/context/FlexibleSplitsContext";
import useFlexibleSplits, { OnSplitsUpdate, UseFlexibleSplitsProps } from "@renderer/hook/useFlexibleSplits";
import TabControls from "@renderer/components/Tabs/TabControls/TabControls";
import TabButton from "@renderer/components/Tabs/TabControls/TabButton/TabButton";
import SplitView from "@renderer/components/SplitView/SplitView";


export default function ModuleView(props: UseFlexibleSplitsProps): ReactNode {
  const pSceneBlueprint: SplitTreeBlueprint | null | undefined = 
    props.splitTreeBlueprint;
  const pContentProvider: TabContentProvider = props.contentProvider;
  const pOnUpdate: OnSplitsUpdate | undefined = props.onUpdate;

  const {
    splitTree, 
    tabSelection, 
    handleTabSelection, 
    handleTabOpen,
    handleTabRelocation, 
    handleTabReorder,
    handleTabSplit,
    handleDividerMove
  } = useFlexibleSplits({
    splitTreeBlueprint: pSceneBlueprint,
    contentProvider: pContentProvider,
    onUpdate: pOnUpdate
  });

  const renderTabControls = (targetNode: SplitTreeValue): ReactNode => {
    return (
      <TabControls>
        {targetNode.value.tabs.map((tab: Tab) => {
          return (
            <TabButton
              key={tab.workspace + "-tab-control-button-" + tab.id}
              tab={tab}
            />
          );
        })}
      </TabControls>
    );
  };

  
  return (
    <FlexibleSplitsContext.Provider
      value={{
        splitTree, 
        tabSelection, 
        handleTabSelection, 
        handleTabOpen,
        handleTabRelocation, 
        handleTabReorder,
        handleTabSplit,
        handleDividerMove
      }}
    >
      {splitTree && <SplitView renderControls={renderTabControls} />}
    </FlexibleSplitsContext.Provider>
  );
}
