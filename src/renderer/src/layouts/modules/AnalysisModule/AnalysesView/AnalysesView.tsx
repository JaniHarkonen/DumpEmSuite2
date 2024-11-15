import "./AnalysesView.css";

import { ASSETS } from "@renderer/assets/assets";
import SplitView from "@renderer/components/SplitView/SplitView";
import TabButton from "@renderer/components/Tabs/TabControls/TabButton/TabButton";
import TabControls from "@renderer/components/Tabs/TabControls/TabControls";
import { FlexibleSplitsContext } from "@renderer/context/FlexibleSplitsContext";
import useFlexibleSplits, { UseFlexibleSplitsProps } from "@renderer/hook/useFlexibleSplits";
import { SplitTreeBlueprint, SplitTreeValue } from "@renderer/model/splits";
import { buildTab, Tab, TabContentProvider } from "@renderer/model/tabs";
import { MouseEvent, ReactNode } from "react";


export default function AnalysesView(props: UseFlexibleSplitsProps): ReactNode {
  const pSceneBlueprint: SplitTreeBlueprint | null | undefined 
    = props.splitTreeBlueprint;
  const pContentProvider: TabContentProvider = props.contentProvider;

  const {
    splitTree, 
    tabSelection, 
    handleTabSelection, 
    handleTabOpen,
    handleTabRelocation, 
    handleTabSplit,
    handleDividerMove,
    handleTabAdd,
    handleTabRemove: removeTab
  } = useFlexibleSplits({
    splitTreeBlueprint: pSceneBlueprint,
    contentProvider: pContentProvider
  });

  const handleTabRemove = (
    e: MouseEvent<HTMLImageElement>, targetNode: SplitTreeValue, tab: Tab
  ) => {
    e.stopPropagation();
    removeTab(targetNode, tab);
  };
  
  const renderTabControls = (targetNode: SplitTreeValue): ReactNode => {
    const tabs: Tab[] = targetNode.value.tabs;
    return (
      <TabControls>
        {tabs.map((tab: Tab, tabIndex: number) => {
          const tabTags: string[] = tab.tags!;
          return (
            <TabButton
              key={tab.workspace + "-tab-control-button-" + tab.id}
              tab={tab}
            >
              {!tabTags.includes("permanent") && (
                <span className="tab-remove-icon-container">
                  <img
                    className="tab-remove-icon"
                    src={ASSETS.icons.buttons.trashCan.white}
                    onClick={(e: MouseEvent<HTMLImageElement>) => {
                      handleTabRemove(e, targetNode, tabs[tabIndex]);
                    }}
                  />
                </span>
              )}
            </TabButton>
          );
        })}
        <button onClick={() => {
          handleTabAdd(targetNode, buildTab({
              id: "new-tab-test",
              workspace: "ws-test",
              caption: "New tab",
              contentTemplate: "tab-volume",
              tags: []
            }, pContentProvider));
          }}
        >
          +
        </button>
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
