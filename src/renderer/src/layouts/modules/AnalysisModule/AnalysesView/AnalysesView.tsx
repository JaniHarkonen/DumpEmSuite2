import "./AnalysesView.css";

import { ASSETS } from "@renderer/assets/assets";
import SplitView from "@renderer/components/SplitView/SplitView";
import TabButton from "@renderer/components/Tabs/TabControls/TabButton/TabButton";
import TabControls from "@renderer/components/Tabs/TabControls/TabControls";
import { FlexibleSplitsContext } from "@renderer/context/FlexibleSplitsContext";
import { WorkspaceContext } from "@renderer/context/WorkspaceContext";
import useFlexibleSplits, { OnSplitsUpdate, UseFlexibleSplitsProps } from "@renderer/hook/useFlexibleSplits";
import { SplitTreeBlueprint, SplitTreeValue } from "@renderer/model/splits";
import { buildTab, SceneConfigBlueprint, Tab, TabContentProvider } from "@renderer/model/tabs";
import generateRandomUniqueID from "@renderer/utils/generateRandomUniqueID";
import { MouseEvent, ReactNode, useContext } from "react";


const TAGS = {
  permanent: "permanent"
};

function buildFilterationBlueprint(hostID: string): SceneConfigBlueprint {
  return {
    splitTree: {
      root: {
        isFork: true,
        divider: {
          direction: "horizontal",
          value: 50
        },
        left: {
          isFork: true,
          divider: {
            direction: "horizontal",
            value: 50
          },
          left: {
            isFork: true,
            divider: {
              direction: "horizontal",
              value: 50
            },
            left: {
              isFork: false,
              value: {
                tabs: [
                  {
                    id: hostID + "-stocks",
                    workspace: "ws-test",
                    caption: "Stocks",
                    contentTemplate: "view-filteration-tab-stocks",
                    tags: [],
                    order: 0
                  }
                ],
                activeTabIndex: 0
              }
            }
          },
          right: {
            isFork: true,
            divider: {
              direction: "vertical",
              value: 50
            },
            left: {
              isFork: true,
              divider: {
                direction: "horizontal",
                value: 50
              },
              left: {
                isFork: false,
                value: {
                  tabs: [
                    {
                      id: hostID + "-chart",
                      workspace: "ws-test",
                      caption: "Chart",
                      contentTemplate: "view-filteration-tab-chart",
                      tags: [],
                      order: 0
                    }
                  ],
                  activeTabIndex: 0
                }
              }
            },
            right: {
              isFork: true,
              divider: {
                direction: "horizontal",
                value: 50
              },
              left: {
                isFork: false,
                value: {
                  tabs: [
                    {
                      id: hostID + "-notes",
                      workspace: "ws-test",
                      caption: "Notes",
                      contentTemplate: "view-filteration-tab-notes",
                      tags: [],
                      order: 0
                    }
                  ],
                  activeTabIndex: 0
                }
              }
            }
          }
        }
      }
    }
  };
}

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
    handleTabSplit,
    handleDividerMove,
    handleTabAdd,
    handleTabRemove: removeTab
  } = useFlexibleSplits({
    splitTreeBlueprint: pSceneBlueprint,
    contentProvider: pContentProvider,
    onUpdate: pOnUpdate
  });

  const handleTabRemove = (
    e: MouseEvent<HTMLImageElement>, targetNode: SplitTreeValue, tab: Tab
  ) => {
    e.stopPropagation();
    removeTab(targetNode, tab);
  };

  const handleTabReorder = (targetNode: SplitTreeValue, index: number) => {
    const tab: Tab = tabSelection!.selectedTab;
    if( !tab.tags.includes(TAGS.permanent) ) {
      reorderTab(targetNode, index);
    } else {
      resetTabSelection();
    }
  };

  const buildFilterationTab = (): Tab => {
    const id: string = generateRandomUniqueID("filteration-tab-");
    return buildTab({
      id,
      workspace: workspaceConfig.id,
      caption: "New filter",
      contentTemplate: "tab-volume",
      tags: [],
      sceneConfigBlueprint: buildFilterationBlueprint(id),
      order: 0
    }, pContentProvider);
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
            >
              {!tab.tags.includes(TAGS.permanent) && (
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
        <button onClick={() => handleTabAdd(targetNode, buildFilterationTab())}>
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
