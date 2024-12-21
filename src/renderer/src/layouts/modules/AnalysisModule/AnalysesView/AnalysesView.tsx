import "./AnalysesView.css";

import { ASSETS } from "@renderer/assets/assets";
import SplitView from "@renderer/components/SplitView/SplitView";
import TabButton from "@renderer/components/Tabs/TabControls/TabButton/TabButton";
import TabControls from "@renderer/components/Tabs/TabControls/TabControls";
import { FlexibleSplitsContext } from "@renderer/context/FlexibleSplitsContext";
import { WorkspaceContext } from "@renderer/context/WorkspaceContext";
import useDatabase from "@renderer/hook/useDatabase";
import useFlexibleSplits, { OnSplitsUpdate, UseFlexibleSplitsProps } from "@renderer/hook/useFlexibleSplits";
import { SplitTreeBlueprint, SplitTreeValue } from "@renderer/model/splits";
import { buildTab, Tab, TabContentProvider } from "@renderer/model/tabs";
import generateRandomUniqueID from "@renderer/utils/generateRandomUniqueID";
import { MouseEvent, ReactNode, useContext } from "react";
import { BoundDatabaseAPI } from "src/shared/database.type";
import { buildFilterationBlueprint } from "./buildFilterationBlueprint";
import { FilterationStep } from "src/shared/schemaConfig";


const TAGS = {
  permanent: "permanent"
};

export default function AnalysesView(props: UseFlexibleSplitsProps): ReactNode {
  const pSceneBlueprint: SplitTreeBlueprint | null | undefined = props.splitTreeBlueprint;
  const pContentProvider: TabContentProvider = props.contentProvider;
  const pOnUpdate: OnSplitsUpdate | undefined = props.onUpdate;

  const {workspaceConfig} = useContext(WorkspaceContext);
  const {
    splitTree, 
    tabSelection, 
    handleTabSelection,   
    resetTabSelection,
    handleTabOpen,
    handleTabRelocation, 
    handleTabReorder: reorderTab,
    handleTabCaptionChange: changeTabCaption,
    handleTabSplit,
    handleDividerMove,
    handleTabAdd: addTab,
    handleTabRemove: removeTab
  } = useFlexibleSplits({
    splitTreeBlueprint: pSceneBlueprint,
    contentProvider: pContentProvider,
    onUpdate: pOnUpdate
  });

  const databaseAPI: BoundDatabaseAPI = useDatabase().databaseAPI!;

  const handleTabAdd = (targetNode: SplitTreeValue) => {
    const id: string = generateRandomUniqueID("filteration-tab-");
    const tab: Tab = buildTab({
      id,
      workspace: workspaceConfig.id,
      caption: "New filter",
      contentTemplate: "tab-volume",
      tags: [],
      sceneConfigBlueprint: buildFilterationBlueprint(id),
      order: 0
    }, pContentProvider);

    addTab(targetNode, tab);
    databaseAPI.postNewFilterationStep({
      filterationStep: {
        step_id: id,
        caption: tab.caption
      }
    });
  };

  const handleTabRemove = (
    e: MouseEvent<HTMLImageElement>, targetNode: SplitTreeValue, tab: Tab
  ) => {
    e.stopPropagation();
    removeTab(targetNode, tab);
    databaseAPI.deleteFilterationStep({ step_id: tab.id });
  };

  const handleTabReorder = (targetNode: SplitTreeValue, index: number) => {
    const tab: Tab = tabSelection!.selectedTab;

    if( !tab.tags.includes(TAGS.permanent) ) {
      reorderTab(targetNode, index);
    } else {
      resetTabSelection();
    }
  };

  const handleTabCaptionChange = (
    targetNode: SplitTreeValue, targetTab: Tab, caption: string
  ) => {
    const changedStep: FilterationStep = {
      step_id: targetTab.id,
      caption
    };
    changeTabCaption(targetNode, targetTab, caption);
    databaseAPI.postFilterationStepCaption({ filterationStep: changedStep });
  };
  
  const renderTabControls = (targetNode: SplitTreeValue): ReactNode => {
    const tabs: Tab[] = targetNode.value.tabs;

    return (
      <TabControls>
        {tabs.map((tab: Tab, tabIndex: number) => {
          return (
            <TabButton
              key={tab.workspace + "-tab-control-button-" + tab.id}
              tab={tab}
              isEditable={true}
              onCaptionEdit={(value: string) => handleTabCaptionChange(targetNode, tabs[tabIndex], value)}
            >
              {!tab.tags.includes(TAGS.permanent) && (
                <span
                  className="tab-remove-icon-container"
                  onClick={(e: MouseEvent<HTMLImageElement>) => {
                    handleTabRemove(e, targetNode, tabs[tabIndex]);
                  }}
                >
                  <img
                    className="size-tiny-icon tab-remove-icon"
                    src={ASSETS.icons.buttons.trashCan.white}
                  />
                </span>
              )}
            </TabButton>
          );
        })}
        <button onClick={() => handleTabAdd(targetNode)}>
          {"+"}
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
        handleTabReorder,
        handleTabSplit,
        handleDividerMove
      }}
    >
      {splitTree && <SplitView renderControls={renderTabControls} />}
    </FlexibleSplitsContext.Provider>
  );
}
