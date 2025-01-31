import "../../../../components/Tabs/TabControls/TabButton/TabButton.css";

import SplitView from "@renderer/components/SplitView/SplitView";
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
import buildSectorBlueprint from "./buildSectorBlueprint";
import { MacroSector } from "src/shared/schemaConfig";
import EditableTabButton from "@renderer/components/EditableTabButton/EditableTabButton";
import StyledButton from "@renderer/components/StyledButton/StyledButton";


export default function SectorSelectionView(props: UseFlexibleSplitsProps): ReactNode {
  const pSceneBlueprint: SplitTreeBlueprint | null | undefined = props.splitTreeBlueprint;
  const pContentProvider: TabContentProvider = props.contentProvider;
  const pOnUpdate: OnSplitsUpdate | undefined = props.onUpdate;

  const {workspaceConfig} = useContext(WorkspaceContext);
  const {
    splitTree, 
    tabSelection, 
    handleTabSelection,
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
      <div className="d-flex">
        <TabControls>
          {tabs.map((tab: Tab) => {
            return(
              <EditableTabButton
                key={tab.workspace + "-tab-control-button-" + tab.id}
                tab={tab}
                onCaptionEdit={(value: string) => {
                  handleTabCaptionChange(targetNode, tab, value);
                }}
                onRemove={(e: MouseEvent<HTMLImageElement>) => handleTabRemove(e, targetNode, tab)}
              />
            );
          })}
        </TabControls>
        <div>
          <StyledButton
            className="ml-medium-length"
            onClick={() => handleTabAdd(targetNode)}
          >
            {"+"}
          </StyledButton>
        </div>
      </div>
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
