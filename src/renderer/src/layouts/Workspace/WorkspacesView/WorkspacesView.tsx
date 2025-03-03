import "../../ModuleView/ModuleView.css";

import useSceneConfig from "@renderer/hook/useSceneConfig";
import { buildTab, defaultSceneConfigBlueprint, Tab, TabBlueprint, TabContentProvider } from "@renderer/model/tabs";
import { ReactNode, useContext } from "react";
import Workspace from "../Workspace";
import { SceneContext } from "@renderer/context/SceneContext";
import { SplitTreeValue } from "@renderer/model/splits";
import useFlexibleSplits from "@renderer/hook/useFlexibleSplits";
import TabControls from "@renderer/components/Tabs/TabControls/TabControls";
import EditableTabButton from "@renderer/components/EditableTabButton/EditableTabButton";
import { FlexibleSplitsContext } from "@renderer/context/FlexibleSplitsContext";
import SplitView from "@renderer/components/SplitView/SplitView";
import { ASSETS } from "@renderer/assets/assets";
import Toolbar from "@renderer/components/Toolbar/Toolbar";
import { ModalContext } from "@renderer/context/ModalContext";
import YesNoModal from "@renderer/layouts/modals/YesNoModal/YesNoModal";
import { GlobalContext } from "@renderer/context/GlobalContext";
import { QueryResult } from "src/shared/database.type";


const {databaseAPI} = window.api;

export default function WorkspacesView(): ReactNode {
  const tabsProvider: TabContentProvider = {
    getContent: (tabBlueprint: TabBlueprint) => (
      <SceneContext.Provider value={{
        sceneConfig: tabBlueprint.sceneConfigBlueprint || defaultSceneConfigBlueprint()
      }}>
        <Workspace />
      </SceneContext.Provider>
    )
  };

  const {openModal} = useContext(ModalContext);
  const {config} = useContext(GlobalContext);
  const {sceneConfig, handleSplitTreeUpdate} = useSceneConfig();

  const {
    splitTree, 
    tabSelection, 
    handleTabSelection,
    handleTabOpen: openTab,
    handleTabAdd,
    handleTabRelocation, 
    handleTabReorder,
    handleTabSplit,
    handleDividerMove,
    handleTabRemove: removeTab
  } = useFlexibleSplits({
    splitTreeBlueprint: sceneConfig.splitTree,
    contentProvider: tabsProvider,
    onUpdate: handleSplitTreeUpdate
  });

  const handleTabOpen = (targetNode: SplitTreeValue, tabIndex: number) => {
    openTab(targetNode, tabIndex);

    if( config && config.activeWorkspaceIDRef ) {
      config.activeWorkspaceIDRef.current = targetNode.value.tabs[tabIndex].workspace ?? null;
    }
  };

  const handleWorkspaceAdd = (
    workspaceTabBlueprint: TabBlueprint, targetNode: SplitTreeValue
  ) => {
    const tab: Tab = buildTab(workspaceTabBlueprint, tabsProvider);
    handleTabAdd(targetNode, tab);
  };

  const handleTabRemove = (
    e: React.MouseEvent<HTMLImageElement>, targetNode: SplitTreeValue, tab: Tab
  ) => {
    e.stopPropagation();

    openModal(
      <YesNoModal onYes={() => {
        databaseAPI.close({ databaseName: tab.id }).then((result: QueryResult) => {
          if( result.wasSuccessful ) {
            removeTab(targetNode, tab);
          }
        });
      }}>
        Are you sure you want to close <strong>'{tab.caption}'</strong>?
      </YesNoModal>
    );
  };
  
  const renderTabControls = (targetNode: SplitTreeValue): ReactNode => {
    const tabs: Tab[] = targetNode.value.tabs;
    return (
      <TabControls>
        {tabs.map((tab: Tab) => {
          return (
            <EditableTabButton
              key={tab.workspace + "-tab-control-button-" + tab.id}
              tab={tab}
              allowEdit={false}
              allowRemove={true}
              iconURL={ASSETS.icons.action.close.black}
              onRemove={(e: React.MouseEvent<HTMLImageElement>) => {
                handleTabRemove(e, targetNode, tab);
              }}
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
      <Toolbar addWorkspace={handleWorkspaceAdd} />
      {splitTree && <SplitView renderControls={renderTabControls} />}
    </FlexibleSplitsContext.Provider>
  );
}
