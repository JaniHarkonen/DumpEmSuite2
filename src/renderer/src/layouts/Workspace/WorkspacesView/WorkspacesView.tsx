import "../../ModuleView/ModuleView.css";

import useSceneConfig from "@renderer/hook/useSceneConfig";
import { buildTab, defaultSceneConfigBlueprint, Tab, TabBlueprint, TabContentProvider } from "@renderer/model/tabs";
import { ReactNode } from "react";
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

  const {sceneConfig, handleSplitTreeUpdate} = useSceneConfig();

  const {
    splitTree, 
    tabSelection, 
    handleTabSelection,
    handleTabOpen,
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
    removeTab(targetNode, tab);
    databaseAPI.close({ databaseName: tab.id });
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
              iconURL={ASSETS.icons.buttons.close.black}
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
