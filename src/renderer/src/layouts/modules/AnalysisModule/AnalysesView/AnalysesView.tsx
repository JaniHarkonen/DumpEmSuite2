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
import { buildFilterationBlueprint } from "../../../../json/buildFilterationBlueprint";
import { FilterationStep } from "src/shared/schemaConfig";
import EditableTabButton from "@renderer/components/EditableTabButton/EditableTabButton";
import StyledButton from "@renderer/components/StyledButton/StyledButton";
import { ModalContext } from "@renderer/context/ModalContext";
import YesNoModal from "@renderer/layouts/modals/YesNoModal/YesNoModal";
import useTabKeys from "@renderer/hook/useTabKeys";
import useViewEvents from "@renderer/hook/useViewEvents";


const TAGS = {
  permanent: "permanent"
};

export default function AnalysesView(props: UseFlexibleSplitsProps): ReactNode {
  const pSceneBlueprint: SplitTreeBlueprint | null | undefined = props.splitTreeBlueprint;
  const pContentProvider: TabContentProvider = props.contentProvider;
  const pOnUpdate: OnSplitsUpdate | undefined = props.onUpdate;

  const {formatKey} = useTabKeys();
  const {emit} = useViewEvents();
  const {openModal} = useContext(ModalContext);
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
    handleTabRemove: removeTab,
    handleExtraInfo
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
      contentTemplate: "none",
      tags: [],
      sceneConfigBlueprint: buildFilterationBlueprint(id, workspaceConfig.id),
      order: 0
    }, pContentProvider);

    addTab(targetNode, tab);
    databaseAPI.postNewFilterationStep({
      filterationStep: {
        step_id: id,
        caption: tab.caption
      }
    });
    emit(null, "filtration-steps-changed");
  };

  const handleTabRemove = (
    e: MouseEvent<HTMLImageElement>, targetNode: SplitTreeValue, tab: Tab
  ) => {
    e.stopPropagation();

    openModal(
      <YesNoModal onYes={() => {
        removeTab(targetNode, tab);
        databaseAPI.deleteFilterationStep({ step_id: tab.id });
        emit(null, "filtration-steps-changed");
      }}>
        <div>
          <div>
            Are you sure you want to remove filtration step <strong>'{tab.caption}'</strong>?
          </div>
          <div>
            All associated information including the notes of this step and verdicts will be lost.
          </div>
        </div>
      </YesNoModal>
    );
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
    emit(null, "filtration-steps-changed");
  };
  
  const renderTabControls = (targetNode: SplitTreeValue): ReactNode => {
    const tabs: Tab[] = targetNode.value.tabs;

    return (
      <div className="d-flex">
        <TabControls>
          {tabs.map((tab: Tab) => {
            const isFundamental: boolean = tab.tags.includes(TAGS.permanent);

            return (
              <EditableTabButton
                key={formatKey(tab.workspace + "-tab-control-button-" + tab.id)}
                tab={tab}
                allowEdit={!isFundamental}
                allowRemove={!isFundamental}
                onCaptionEdit={(value: string) => {
                  handleTabCaptionChange(targetNode, tab, value);
                }}
                onRemove={(e: MouseEvent<HTMLImageElement>) => {
                  handleTabRemove(e, targetNode, tab);
                }}
              />
            );
          })}
        </TabControls>
        <div >
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
        handleDividerMove,
        handleExtraInfo
      }}
    >
      {splitTree && <SplitView renderControls={renderTabControls} />}
    </FlexibleSplitsContext.Provider>
  );
}
