import { SplitTreeBlueprint, SplitTreeValue } from "@renderer/model/splits";
import { Tab, TabContentProvider } from "@renderer/model/tabs";
import SplitView from "../SplitView/SplitView";
import { ReactNode } from "react";
import { FlexibleSplitsContext } from "@renderer/context/FlexibleSplitsContext";
import useFlexibleSplits, { UseFlexibleSplitsProps } from "@renderer/hook/useFlexibleSplits";
import TabControls from "../Tabs/TabControls/TabControls";
import TabButton from "../Tabs/TabControls/TabButton/TabButton";


export default function ModuleView(props: UseFlexibleSplitsProps): ReactNode {
  const pSceneBlueprint: SplitTreeBlueprint | null | undefined = props.splitTreeBlueprint;
  const pContentProvider: TabContentProvider = props.contentProvider;

  const {
    splitTree, 
    tabSelection, 
    handleTabSelection, 
    handleTabOpen,
    handleTabRelocation, 
    handleTabSplit,
    handleDividerMove
  } = useFlexibleSplits({
    splitTreeBlueprint: pSceneBlueprint,
    contentProvider: pContentProvider
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
        handleTabSplit,
        handleDividerMove
      }}
    >
      {splitTree && <SplitView renderControls={renderTabControls} />}
    </FlexibleSplitsContext.Provider>
  );
}
