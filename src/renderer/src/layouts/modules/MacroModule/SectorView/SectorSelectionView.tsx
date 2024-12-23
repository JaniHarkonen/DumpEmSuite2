import "../../../../components/Tabs/TabControls/TabButton/TabButton.css";

import { ASSETS } from "@renderer/assets/assets";
import SplitView from "@renderer/components/SplitView/SplitView";
import TabButton from "@renderer/components/Tabs/TabControls/TabButton/TabButton";
import TabControls from "@renderer/components/Tabs/TabControls/TabControls";
import { FlexibleSplitsContext } from "@renderer/context/FlexibleSplitsContext";
import { WorkspaceContext } from "@renderer/context/WorkspaceContext";
import useDatabase from "@renderer/hook/useDatabase";
import useFlexibleSplits, { OnSplitsUpdate, UseFlexibleSplitsProps } from "@renderer/hook/useFlexibleSplits";
import { SplitTree, SplitTreeBlueprint, SplitTreeValue } from "@renderer/model/splits";
import { buildTab, Tab, TabContentProvider } from "@renderer/model/tabs";
import generateRandomUniqueID from "@renderer/utils/generateRandomUniqueID";
import { MouseEvent, ReactNode, useContext } from "react";
import { BoundDatabaseAPI } from "src/shared/database.type";
import buildSectorBlueprint from "./buildSectorBlueprint";
import { MacroSector } from "src/shared/schemaConfig";


export default function SectorSelectionView(props: UseFlexibleSplitsProps): ReactNode {
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
    onUpdate: (blueprint: SplitTreeBlueprint, newTree: SplitTree) => {pOnUpdate!(blueprint, newTree); console.log("done")}
  });

  const databaseAPI: BoundDatabaseAPI = useDatabase().databaseAPI!;

  const handleTabAdd = (targetNode: SplitTreeValue) => {
    const id: string = generateRandomUniqueID("view-sector-");
    const tab: Tab = buildTab({
      id,
      workspace: workspaceConfig.id,
      caption: "New sector",
      contentTemplate: "view-sector-analysis",
      tags: [],
      sceneConfigBlueprint: buildSectorBlueprint(id, workspaceConfig.id),
      order: 0
    }, pContentProvider);

    console.log(targetNode, tab)
    addTab(targetNode, tab);
    databaseAPI.postNewMacroSector({
      macroSector: {
        sector_id: id,
        sector_name: tab.caption
      }
    });
  };

  const handleTabRemove = (
    e: MouseEvent<HTMLImageElement>, targetNode: SplitTreeValue, tab: Tab
  ) => {
    e.stopPropagation();
    removeTab(targetNode, tab);
    databaseAPI.deleteMacroSector({ macroSectorID: tab.id });
  };

  const handleTabReorder = (targetNode: SplitTreeValue, index: number) => {
    reorderTab(targetNode, index);
  };

  const handleTabCaptionChange = (
    targetNode: SplitTreeValue, targetTab: Tab, caption: string
  ) => {
    const changedSector: MacroSector = {
      sector_id: targetTab.id,
      sector_name: caption
    };
    changeTabCaption(targetNode, targetTab, caption);
    databaseAPI.postMacroSectorCaption({ macroSector: changedSector });
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
              onCaptionEdit={(value: string) => {
                handleTabCaptionChange(targetNode, tabs[tabIndex], value);
              }}
            >
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
