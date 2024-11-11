import { ReactNode } from "react";
import Divider from "../Divider/Divider";
import useFlexibleSplits from "@renderer/hook/useFlexibleSplits";
import { Tab } from "@renderer/model/tabs";
import { DividerDirection, SplitBranch, SplitTree, SplitTreeFork, SplitTreeNode, SplitTreeValue } from "@renderer/model/splits";
import TabsWithDropArea from "../TabsWithDropArea/TabsWithDropArea";
import { DropAreaSettings } from "../DropArea/DropArea";
import { quadrantDropAreas } from "../DropArea/quadrantDropAreas";
import TabControls from "../Tabs/TabControls/TabControls";
import { TabsContext } from "@renderer/context/TabsContext";
import TabPanel from "../Tabs/TabPanel/TabPanel";
import TabButton from "../Tabs/TabControls/TabButton/TabButton";


const dropAreas: DropAreaSettings[] = quadrantDropAreas(
  <div 
    style={{
      backgroundColor: "red", 
      width: "100%", 
      height: "100%", 
      opacity: "25%"
    }}
  />
);

type Props = {
  splitTree: SplitTree;
};

export default function SplitView(props: Props): ReactNode {
  const pSplitTree: SplitTree = props.splitTree;

  const {
    splitTree, 
    tabSelection, 
    handleTabSelection, 
    handleTabOpen,
    handleTabRelocation, 
    handleTabSplit,
    handleDividerMove
  } = useFlexibleSplits({ splitTree: pSplitTree });

  const handleTabContentDrop = (dropArea: DropAreaSettings, toFork: SplitTreeFork) => {
      // Maps drop areas to DividerDirections and DividerDirections to SplitBranches
    const branchings = {
      "top-left": "horizontal",
      "top-right": "vertical",
      "bottom-left": "vertical",
      "bottom-right": "horizontal",
      "horizontal": {
        "top-left": "left",
        "bottom-right": "right"
      },
      "vertical": {
        "top-right": "left",
        "bottom-left": "right"
      }
    };
    const requestedDirection: DividerDirection = branchings[dropArea.id];
    const requestedBranch: SplitBranch = branchings[requestedDirection][dropArea.id];
    handleTabSplit(toFork, requestedDirection, requestedBranch);
  };

  const renderTabControls = (tabs: Tab[]): ReactNode => {
      // Render and sort into tab groups
    return (
      <TabControls>
        {tabs.map((tab: Tab) => <TabButton tab={tab}/>)}
      </TabControls>
    );
  };

  const renderSplits = (root: SplitTreeNode): ReactNode => {
    if( !root.isFork ) {
      const valueNode: SplitTreeValue = root as SplitTreeValue;
      const nodeTabs: Tab[] = valueNode.value.tabs;

      return (
        <TabsContext.Provider value={{
            tabs: nodeTabs,
            activeTabIndex: valueNode.value.activeTabIndex,
            onSelect: (tab: Tab) => handleTabSelection({
              selectedTab: tab,
              sourceFork: valueNode.parent!,
              sourceValueNode: valueNode
            }),
            onOpen: (openedTab: Tab) => {
              handleTabOpen(valueNode, nodeTabs.indexOf(openedTab));
            },
            onDrop: () => handleTabRelocation(valueNode)
          }}
        >
          <TabsWithDropArea
            controls={renderTabControls(nodeTabs)}
            dropAreas={dropAreas}
            onContentDrop={(dropArea: DropAreaSettings) => {
              handleTabContentDrop(dropArea, valueNode.parent!);
            }}
            isDropActive={!!tabSelection}
          >
            {nodeTabs.map((tab: Tab) => {
              return (
                <TabPanel
                  key={tab.workspace + "-tab-panel-" + tab.id}
                  tab={tab}
                >
                  {tab.content}
                </TabPanel>
              );
            })}
          </TabsWithDropArea>
        </TabsContext.Provider>
      );
    }

    const fork: SplitTreeFork = root as SplitTreeFork;
    return (
      <Divider
        dividerSettings={fork.divider}
        onDividerMove={(newValue: number) => handleDividerMove(fork, newValue)}
      >
        {renderSplits(fork.left)}
        {fork.right && renderSplits(fork.right)}
      </Divider>
    );
  };


  return (
    <div className="w-100 h-100 overflow-hidden">
      {splitTree && renderSplits(splitTree.root)}
    </div>
  );
}
